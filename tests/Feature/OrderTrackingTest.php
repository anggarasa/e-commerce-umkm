<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderStatusUpdated;
use Illuminate\Support\Facades\Notification;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('allows authenticated user to view their orders', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get('/my-orders')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('storefront/orders/index')
            ->has('orders.data', 1)
            ->has('statuses')
        );
});

it('only shows orders belonging to the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Order::factory()->create(['user_id' => $user->id]);
    Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->get('/my-orders')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('orders.data', 1)
        );
});

it('requires authentication to view my orders', function () {
    $this->get('/my-orders')
        ->assertRedirect('/login');
});

it('displays the order tracking form for guests', function () {
    $this->get('/orders/track')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('storefront/orders/track')
        );
});

it('allows tracking an order by order number', function () {
    $order = Order::factory()->create(['order_number' => 'ORD20241224TEST']);

    $this->post('/orders/track', ['order_number' => 'ORD20241224TEST'])
        ->assertRedirect('/orders/ORD20241224TEST');
});

it('allows tracking with # prefix', function () {
    $order = Order::factory()->create(['order_number' => 'ORD20241224TEST']);

    $this->post('/orders/track', ['order_number' => '#ORD20241224TEST'])
        ->assertRedirect('/orders/ORD20241224TEST');
});

it('returns error for non-existent order number', function () {
    $this->post('/orders/track', ['order_number' => 'INVALID123'])
        ->assertSessionHasErrors('order_number');
});

it('allows viewing order details by order number', function () {
    $order = Order::factory()->create(['order_number' => 'ORD20241224TEST']);

    $this->get('/orders/ORD20241224TEST')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('storefront/orders/show')
            ->has('order')
            ->has('statuses')
            ->where('order.order_number', 'ORD20241224TEST')
        );
});

it('shows isOwner as true for authenticated user viewing their order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD20241224USER',
    ]);

    $this->actingAs($user)
        ->get('/orders/ORD20241224USER')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('isOwner', true)
        );
});

it('shows isOwner as false for non-owner', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $otherUser->id,
        'order_number' => 'ORD20241224OTHER',
    ]);

    $this->actingAs($user)
        ->get('/orders/ORD20241224OTHER')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('isOwner', false)
        );
});

it('sends email notification when order status changes', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'customer_email' => 'customer@example.com',
        'status' => 'pending',
    ]);
    $order->items()->create([
        'product_id' => Product::factory()->create()->id,
        'product_name' => 'Test Product',
        'product_price' => 10000,
        'quantity' => 1,
        'subtotal' => 10000,
    ]);

    $this->actingAs($user)
        ->put("/admin/orders/{$order->id}", [
            'status' => 'processing',
            'admin_notes' => '',
        ])
        ->assertRedirect();

    Notification::assertSentOnDemand(
        OrderStatusUpdated::class,
        function ($notification, $channels, $notifiable) use ($order) {
            return $notification->order->id === $order->id
                && $notification->oldStatus === 'pending'
                && $notification->newStatus === 'processing'
                && $notifiable->routes['mail'] === 'customer@example.com';
        }
    );
});

it('does not send email notification when status does not change', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'customer_email' => 'customer@example.com',
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->put("/admin/orders/{$order->id}", [
            'status' => 'pending',
            'admin_notes' => 'Just adding a note',
        ])
        ->assertRedirect();

    Notification::assertNothingSent();
});

it('does not send email notification when customer has no email', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'customer_email' => null,
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->put("/admin/orders/{$order->id}", [
            'status' => 'processing',
            'admin_notes' => '',
        ])
        ->assertRedirect();

    Notification::assertNothingSent();
});

it('filters orders by status', function () {
    $user = User::factory()->create();
    Order::factory()->create(['user_id' => $user->id, 'status' => 'pending']);
    Order::factory()->create(['user_id' => $user->id, 'status' => 'processing']);
    Order::factory()->create(['user_id' => $user->id, 'status' => 'delivered']);

    $this->actingAs($user)
        ->get('/my-orders?status=pending')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('orders.data', 1)
        );
});
