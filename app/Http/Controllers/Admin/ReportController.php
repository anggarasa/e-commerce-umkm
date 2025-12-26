<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SalesReportExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    /**
     * Display the sales report index page.
     */
    public function index(Request $request): Response
    {
        $period = $request->input('period', '30days');
        $dateRange = $this->getDateRange($period, $request);

        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        // Get summary statistics
        $stats = $this->getStatistics($startDate, $endDate);

        // Get daily sales data for chart
        $dailySales = $this->getDailySales($startDate, $endDate);

        // Get top selling products
        $topProducts = $this->getTopProducts($startDate, $endDate, 5);

        // Get recent orders
        $recentOrders = Order::with('items')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest()
            ->take(10)
            ->get();

        // Get sales by status
        $salesByStatus = $this->getSalesByStatus($startDate, $endDate);

        return Inertia::render('admin/reports/index', [
            'stats' => $stats,
            'dailySales' => $dailySales,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'salesByStatus' => $salesByStatus,
            'filters' => [
                'period' => $period,
                'date_from' => $startDate->format('Y-m-d'),
                'date_to' => $endDate->format('Y-m-d'),
            ],
            'statuses' => Order::STATUSES,
        ]);
    }

    /**
     * Export sales report to Excel.
     */
    public function export(Request $request): BinaryFileResponse
    {
        $period = $request->input('period', '30days');
        $dateRange = $this->getDateRange($period, $request);

        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        $filename = 'laporan-penjualan-'.$startDate->format('Y-m-d').'-'.$endDate->format('Y-m-d').'.xlsx';

        return Excel::download(
            new SalesReportExport($startDate, $endDate),
            $filename
        );
    }

    /**
     * Get date range based on period selection.
     */
    private function getDateRange(string $period, Request $request): array
    {
        $now = Carbon::now();

        return match ($period) {
            'today' => [
                'start' => $now->copy()->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
            '7days' => [
                'start' => $now->copy()->subDays(6)->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
            '30days' => [
                'start' => $now->copy()->subDays(29)->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
            'this_month' => [
                'start' => $now->copy()->startOfMonth(),
                'end' => $now->copy()->endOfMonth(),
            ],
            'last_month' => [
                'start' => $now->copy()->subMonth()->startOfMonth(),
                'end' => $now->copy()->subMonth()->endOfMonth(),
            ],
            'custom' => [
                'start' => $request->filled('date_from')
                    ? Carbon::parse($request->date_from)->startOfDay()
                    : $now->copy()->subDays(29)->startOfDay(),
                'end' => $request->filled('date_to')
                    ? Carbon::parse($request->date_to)->endOfDay()
                    : $now->copy()->endOfDay(),
            ],
            default => [
                'start' => $now->copy()->subDays(29)->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
        };
    }

    /**
     * Get summary statistics.
     */
    private function getStatistics(Carbon $startDate, Carbon $endDate): array
    {
        // Total revenue from delivered orders
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered')
            ->sum('total');

        // Total orders
        $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Successful orders (delivered)
        $successfulOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered')
            ->count();

        // Total products sold
        $totalProductsSold = OrderItem::whereHas('order', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'delivered');
        })->sum('quantity');

        // Pending revenue (orders not yet delivered/cancelled)
        $pendingRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['pending', 'processing', 'shipped'])
            ->sum('total');

        // Calculate growth compared to previous period
        $periodDays = $startDate->diffInDays($endDate) + 1;
        $previousStart = $startDate->copy()->subDays($periodDays);
        $previousEnd = $startDate->copy()->subDay();

        $previousRevenue = Order::whereBetween('created_at', [$previousStart, $previousEnd])
            ->where('status', 'delivered')
            ->sum('total');

        $revenueGrowth = $previousRevenue > 0
            ? round((($totalRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : ($totalRevenue > 0 ? 100 : 0);

        $previousOrders = Order::whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();

        $ordersGrowth = $previousOrders > 0
            ? round((($totalOrders - $previousOrders) / $previousOrders) * 100, 1)
            : ($totalOrders > 0 ? 100 : 0);

        return [
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
            'successful_orders' => $successfulOrders,
            'total_products_sold' => $totalProductsSold,
            'pending_revenue' => $pendingRevenue,
            'revenue_growth' => $revenueGrowth,
            'orders_growth' => $ordersGrowth,
            'average_order_value' => $totalOrders > 0 ? round($totalRevenue / max($successfulOrders, 1), 2) : 0,
        ];
    }

    /**
     * Get daily sales data for chart.
     */
    private function getDailySales(Carbon $startDate, Carbon $endDate): array
    {
        $sales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered')
            ->selectRaw('DATE(created_at) as date, SUM(total) as total, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $result = [];
        $current = $startDate->copy();

        while ($current <= $endDate) {
            $dateKey = $current->format('Y-m-d');
            $result[] = [
                'date' => $dateKey,
                'label' => $current->format('d M'),
                'total' => isset($sales[$dateKey]) ? (float) $sales[$dateKey]->total : 0,
                'orders' => isset($sales[$dateKey]) ? (int) $sales[$dateKey]->orders : 0,
            ];
            $current->addDay();
        }

        return $result;
    }

    /**
     * Get top selling products.
     */
    private function getTopProducts(Carbon $startDate, Carbon $endDate, int $limit = 5): array
    {
        return OrderItem::whereHas('order', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'delivered');
        })
            ->select('product_id', 'product_name')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(subtotal) as total_revenue')
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_revenue' => (float) $item->total_revenue,
                ];
            })
            ->toArray();
    }

    /**
     * Get sales breakdown by status.
     */
    private function getSalesByStatus(Carbon $startDate, Carbon $endDate): array
    {
        return Order::whereBetween('created_at', [$startDate, $endDate])
            ->select('status')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(total) as total')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'label' => Order::STATUSES[$item->status] ?? $item->status,
                    'count' => (int) $item->count,
                    'total' => (float) $item->total,
                ];
            })
            ->toArray();
    }
}
