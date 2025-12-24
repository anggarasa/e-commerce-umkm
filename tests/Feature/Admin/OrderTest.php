<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('requires authentication for all routes', function () {
    $order = Order::factory()->create();

    $this->get(route('admin.orders.index'))->assertRedirect(route('login'));
    $this->get(route('admin.orders.show', $order))->assertRedirect(route('login'));
    $this->put(route('admin.orders.update', $order))->assertRedirect(route('login'));
});

test('it can list orders with pagination', function () {
    $user = User::factory()->create();
    Order::factory()->count(15)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.orders.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 10)
            ->has('statuses')
            ->has('filters')
        );
});

test('it can filter orders by status', function () {
    $user = User::factory()->create();
    Order::factory()->pending()->count(3)->create();
    Order::factory()->processing()->count(2)->create();
    Order::factory()->delivered()->count(1)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.orders.index', ['status' => 'pending']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 3)
        );
});

test('it can search orders by order number', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['order_number' => 'ORD20241224TEST']);
    Order::factory()->count(5)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.orders.index', ['search' => 'TEST']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $order->id)
        );
});

test('it can view order detail', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.orders.show', $order));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/show')
            ->has('order')
            ->has('statuses')
        );
});

test('it can update order status', function () {
    $user = User::factory()->create();
    $order = Order::factory()->pending()->create();

    $response = $this->actingAs($user)
        ->put(route('admin.orders.update', $order), [
            'status' => 'processing',
            'admin_notes' => 'Pesanan sedang diproses',
        ]);

    $response->assertRedirect(route('admin.orders.show', $order));

    $order->refresh();
    expect($order->status)->toBe('processing');
    expect($order->admin_notes)->toBe('Pesanan sedang diproses');
});

test('it validates status when updating order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($user)
        ->put(route('admin.orders.update', $order), [
            'status' => 'invalid_status',
        ]);

    $response->assertSessionHasErrors('status');
});

