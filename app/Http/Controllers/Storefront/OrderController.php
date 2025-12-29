<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\RequestCancellationRequest;
use App\Models\Order;
use App\Services\AdminNotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display list of orders for authenticated user.
     */
    public function myOrders(Request $request): Response
    {
        $user = $request->user();

        $query = Order::where('user_id', $user->id)
            ->with('items')
            ->latest();

        // Status filter
        if ($request->filled('status')) {
            $query->status($request->status);
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('storefront/orders/index', [
            'orders' => $orders,
            'statuses' => Order::STATUSES,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Display the order tracking form.
     */
    public function trackForm(): Response
    {
        return Inertia::render('storefront/orders/track');
    }

    /**
     * Track an order by order number.
     */
    public function track(Request $request): RedirectResponse
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        $orderNumber = $request->order_number;

        // Remove # prefix if exists
        $orderNumber = ltrim($orderNumber, '#');

        $order = Order::where('order_number', $orderNumber)->first();

        if (! $order) {
            return back()->withErrors([
                'order_number' => 'Pesanan dengan nomor tersebut tidak ditemukan.',
            ])->withInput();
        }

        return redirect()->route('orders.show', $order->order_number);
    }

    /**
     * Display the specified order.
     */
    public function show(string $orderNumber): Response|RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product.media' => fn ($q) => $q->where('is_primary', true)])
            ->first();

        if (! $order) {
            return redirect()->route('orders.track')
                ->withErrors(['order_number' => 'Pesanan tidak ditemukan.']);
        }

        // If user is logged in, check if they own this order or if they are accessing as guest
        $user = auth()->user();
        $isOwner = $user && $order->user_id === $user->id;

        return Inertia::render('storefront/orders/show', [
            'order' => $order,
            'statuses' => Order::STATUSES,
            'isOwner' => $isOwner,
        ]);
    }

    /**
     * Request cancellation for an order.
     */
    public function requestCancellation(RequestCancellationRequest $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)->first();

        if (! $order) {
            return redirect()->route('orders.track')
                ->withErrors(['order_number' => 'Pesanan tidak ditemukan.']);
        }

        // Check if order can be cancelled (only pending or processing)
        if (! in_array($order->status, ['pending', 'processing'])) {
            return back()->withErrors([
                'cancellation_reason' => 'Pesanan dengan status ini tidak dapat dibatalkan.',
            ]);
        }

        // Check if cancellation already requested
        if ($order->cancellation_requested) {
            return back()->withErrors([
                'cancellation_reason' => 'Request pembatalan sudah pernah diajukan untuk pesanan ini.',
            ]);
        }

        $order->update([
            'cancellation_requested' => true,
            'cancellation_reason' => $request->cancellation_reason,
            'cancellation_requested_at' => now(),
        ]);

        // Create admin notification for cancellation request
        app(AdminNotificationService::class)->notifyCancellationRequest($order);

        return redirect()->route('orders.show', $order->order_number)
            ->with('success', 'Request pembatalan berhasil diajukan. Admin akan memproses permintaan Anda.');
    }
}
