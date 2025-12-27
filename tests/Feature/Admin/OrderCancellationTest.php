<?php

use App\Models\Order;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create();
});

describe('Order Cancellation Management', function () {
    it('shows cancellation requests count on orders index', function () {
        // Create orders with cancellation requests
        Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Berubah pikiran',
            'status' => 'pending',
        ]);
        Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Salah pesan',
            'status' => 'processing',
        ]);
        // Already cancelled order should not be counted
        Order::factory()->create([
            'cancellation_requested' => true,
            'status' => 'cancelled',
        ]);
        // Normal order without cancellation request
        Order::factory()->create([
            'cancellation_requested' => false,
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/orders');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->has('cancellationRequestsCount')
            ->where('cancellationRequestsCount', 2)
        );
    });

    it('can filter orders by cancellation requests', function () {
        Order::factory()->create([
            'cancellation_requested' => true,
            'order_number' => 'ORD-CANCEL-001',
        ]);
        Order::factory()->create([
            'cancellation_requested' => false,
            'order_number' => 'ORD-NORMAL-001',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/orders?cancellation_request=true');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', 'ORD-CANCEL-001')
        );
    });

    it('shows cancellation request details on order show page', function () {
        $order = Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Ingin mengubah alamat pengiriman',
            'cancellation_requested_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->get("/admin/orders/{$order->id}");

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->where('order.cancellation_requested', true)
            ->where('order.cancellation_reason', 'Ingin mengubah alamat pengiriman')
        );
    });

    it('can approve cancellation request', function () {
        $order = Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Tidak jadi beli',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/approve-cancellation");

        $response->assertRedirect("/admin/orders/{$order->id}");
        $response->assertSessionHas('success');

        $order->refresh();
        expect($order->status)->toBe('cancelled');
        expect($order->cancellation_requested)->toBeFalse();
    });

    it('cannot approve cancellation for order without request', function () {
        $order = Order::factory()->create([
            'cancellation_requested' => false,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/approve-cancellation");

        $response->assertRedirect("/admin/orders/{$order->id}");
        $response->assertSessionHas('error');

        $order->refresh();
        expect($order->status)->toBe('pending');
    });

    it('can reject cancellation request', function () {
        $order = Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Berubah pikiran',
            'cancellation_requested_at' => now(),
            'status' => 'processing',
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/reject-cancellation");

        $response->assertRedirect("/admin/orders/{$order->id}");
        $response->assertSessionHas('success');

        $order->refresh();
        expect($order->status)->toBe('processing');
        expect($order->cancellation_requested)->toBeFalse();
        expect($order->cancellation_reason)->toBeNull();
        expect($order->cancellation_requested_at)->toBeNull();
    });

    it('cannot reject cancellation for order without request', function () {
        $order = Order::factory()->create([
            'cancellation_requested' => false,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/reject-cancellation");

        $response->assertRedirect("/admin/orders/{$order->id}");
        $response->assertSessionHas('error');
    });

    it('sends email notification when rejecting cancellation request', function () {
        \Illuminate\Support\Facades\Notification::fake();

        $order = Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Berubah pikiran',
            'cancellation_requested_at' => now(),
            'status' => 'processing',
            'customer_email' => 'customer@example.com',
        ]);

        $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/reject-cancellation");

        \Illuminate\Support\Facades\Notification::assertSentOnDemand(
            \App\Notifications\CancellationRejected::class,
            function ($notification, $channels, $notifiable) use ($order) {
                return $notifiable->routes['mail'] === 'customer@example.com'
                    && $notification->order->id === $order->id
                    && $notification->cancellationReason === 'Berubah pikiran';
            }
        );
    });

    it('does not send email notification when order has no email', function () {
        \Illuminate\Support\Facades\Notification::fake();

        $order = Order::factory()->create([
            'cancellation_requested' => true,
            'cancellation_reason' => 'Berubah pikiran',
            'status' => 'processing',
            'customer_email' => null,
        ]);

        $this->actingAs($this->admin)
            ->post("/admin/orders/{$order->id}/reject-cancellation");

        \Illuminate\Support\Facades\Notification::assertNothingSent();
    });
});
