<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('requires authentication for report routes', function () {
    $this->get(route('admin.reports.index'))->assertRedirect(route('login'));
    $this->get(route('admin.reports.export'))->assertRedirect(route('login'));
});

test('it can view report index page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.reports.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->has('stats')
            ->has('dailySales')
            ->has('topProducts')
            ->has('recentOrders')
            ->has('salesByStatus')
            ->has('filters')
            ->has('statuses')
        );
});

test('it shows correct statistics for delivered orders', function () {
    $user = User::factory()->create();

    // Create some delivered orders
    Order::factory()->delivered()->count(3)->create([
        'total' => 100000,
    ]);

    // Create pending orders (should not count towards revenue)
    Order::factory()->pending()->count(2)->create([
        'total' => 50000,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.reports.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->where('stats.total_orders', 5)
            ->where('stats.successful_orders', 3)
            ->where('stats.total_revenue', 300000)
        );
});

test('it can filter by period', function () {
    $user = User::factory()->create();

    // Create an order from today
    Order::factory()->delivered()->create([
        'total' => 100000,
        'created_at' => now(),
    ]);

    // Create an order from 10 days ago
    Order::factory()->delivered()->create([
        'total' => 200000,
        'created_at' => now()->subDays(10),
    ]);

    // Filter by today - should only show today's order
    $response = $this->actingAs($user)
        ->get(route('admin.reports.index', ['period' => 'today']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->where('stats.total_orders', 1)
            ->where('stats.total_revenue', 100000)
        );

    // Filter by 7 days - should only show today's order
    $response = $this->actingAs($user)
        ->get(route('admin.reports.index', ['period' => '7days']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->where('stats.total_orders', 1)
        );

    // Filter by 30 days - should show both orders
    $response = $this->actingAs($user)
        ->get(route('admin.reports.index', ['period' => '30days']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->where('stats.total_orders', 2)
        );
});

test('it can export sales to Excel', function () {
    $user = User::factory()->create();

    Order::factory()->count(5)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.reports.export'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        ->assertDownload();
});

test('it shows top products correctly', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['name' => 'Product A']);
    $product2 = Product::factory()->create(['name' => 'Product B']);

    // Create delivered orders with order items
    $order1 = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $order1->id,
        'product_id' => $product1->id,
        'product_name' => $product1->name,
        'quantity' => 10,
        'subtotal' => 500000,
    ]);

    $order2 = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $order2->id,
        'product_id' => $product2->id,
        'product_name' => $product2->name,
        'quantity' => 5,
        'subtotal' => 250000,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.reports.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->has('topProducts', 2)
            ->where('topProducts.0.product_name', 'Product A')
            ->where('topProducts.0.total_quantity', 10)
        );
});

test('it can filter by custom date range', function () {
    $user = User::factory()->create();

    // Create orders at specific dates
    Order::factory()->delivered()->create([
        'created_at' => '2024-01-15',
        'total' => 100000,
    ]);

    Order::factory()->delivered()->create([
        'created_at' => '2024-01-20',
        'total' => 200000,
    ]);

    Order::factory()->delivered()->create([
        'created_at' => '2024-02-01',
        'total' => 300000,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.reports.index', [
            'period' => 'custom',
            'date_from' => '2024-01-10',
            'date_to' => '2024-01-25',
        ]));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/reports/index')
            ->where('stats.total_orders', 2)
            ->where('stats.total_revenue', 300000)
        );
});
