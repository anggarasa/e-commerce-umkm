<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Order\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request): Response
    {
        $limit = $request->input('limit', 10);

        $query = Order::with('items')->latest();

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->status($request->status);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->paginate($limit)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'statuses' => Order::STATUSES,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to', 'limit']),
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load(['items.product.media' => fn ($q) => $q->where('is_primary', true), 'user']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'statuses' => Order::STATUSES,
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $oldStatus = $order->status;
        $order->update($request->validated());
        $newStatus = $order->status;

        // Send email notification if status changed and email exists
        if ($oldStatus !== $newStatus && $order->customer_email) {
            $order->load('items');
            \Illuminate\Support\Facades\Notification::route('mail', $order->customer_email)
                ->notify(new \App\Notifications\OrderStatusUpdated($order, $oldStatus, $newStatus));
        }

        return redirect()->route('admin.orders.show', $order)
            ->with('success', 'Status order berhasil diperbarui.');
    }
}
