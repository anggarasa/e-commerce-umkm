<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $now = Carbon::now();
        $startDate = $now->copy()->subDays(29)->startOfDay();
        $endDate = $now->copy()->endOfDay();

        // Get summary statistics
        $stats = $this->getStatistics($startDate, $endDate);

        // Get daily sales data for chart
        $dailySales = $this->getDailySales($startDate, $endDate);

        // Get recent orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(5)
            ->get();

        // Get orders by status
        $ordersByStatus = $this->getOrdersByStatus();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'dailySales' => $dailySales,
            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'statuses' => Order::STATUSES,
        ]);
    }

    /**
     * Get summary statistics.
     */
    private function getStatistics(Carbon $startDate, Carbon $endDate): array
    {
        // Total revenue from delivered orders in period
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered')
            ->sum('total');

        // Total orders in period
        $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Total active products
        $totalProducts = Product::where('is_active', true)->count();

        // Total categories
        $totalCategories = Category::where('is_active', true)->count();

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
            'total_products' => $totalProducts,
            'total_categories' => $totalCategories,
            'revenue_growth' => $revenueGrowth,
            'orders_growth' => $ordersGrowth,
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
     * Get orders count by status.
     */
    private function getOrdersByStatus(): array
    {
        return Order::select('status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'label' => Order::STATUSES[$item->status] ?? $item->status,
                    'count' => (int) $item->count,
                ];
            })
            ->toArray();
    }
}
