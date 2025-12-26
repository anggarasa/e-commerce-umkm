<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('requires authentication for dashboard', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('it can view dashboard page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('stats')
            ->has('dailySales')
            ->has('recentOrders')
            ->has('ordersByStatus')
            ->has('statuses')
        );
});

test('it shows correct statistics', function () {
    $user = User::factory()->create();

    // Create categories first
    $activeCategories = Category::factory()->count(3)->create(['is_active' => true]);
    Category::factory()->count(1)->create(['is_active' => false]);

    // Create active products using existing categories
    Product::factory()->count(5)->create([
        'is_active' => true,
        'category_id' => $activeCategories->first()->id,
    ]);
    Product::factory()->count(2)->create([
        'is_active' => false,
        'category_id' => $activeCategories->first()->id,
    ]);

    // Create delivered orders
    Order::factory()->delivered()->count(3)->create([
        'total' => 100000,
    ]);

    // Create pending orders (should not count towards revenue)
    Order::factory()->pending()->count(2)->create([
        'total' => 50000,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->where('stats.total_orders', 5)
            ->where('stats.total_revenue', '300000.00')
            ->where('stats.total_products', 5)
            ->where('stats.total_categories', 3)
        );
});

test('it shows recent orders', function () {
    $user = User::factory()->create();

    // Create orders
    Order::factory()->count(10)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('recentOrders', 5)
        );
});

test('it shows daily sales data', function () {
    $user = User::factory()->create();

    // Create a delivered order today
    Order::factory()->delivered()->create([
        'total' => 100000,
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('dailySales', 30)
        );
});

test('it shows orders by status', function () {
    $user = User::factory()->create();

    // Create orders with different statuses
    Order::factory()->pending()->count(3)->create();
    Order::factory()->delivered()->count(2)->create();

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('ordersByStatus')
        );
});
