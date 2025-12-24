<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('it can display checkout page with cart items', function () {
    $product = Product::factory()->create(['price' => 100000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => $product->price,
    ]);

    $response = $this->get(route('checkout.create'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('storefront/checkout/index')
            ->has('cart')
            ->has('cart.items', 1)
        );
});

test('it redirects to cart if cart is empty', function () {
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);

    $response = $this->get(route('checkout.create'));

    $response->assertRedirect(route('cart.index'));
});

test('it requires customer information to checkout', function () {
    $product = Product::factory()->create(['price' => 100000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price,
    ]);

    $response = $this->post(route('checkout.store'), []);

    $response->assertSessionHasErrors(['customer_name', 'customer_phone', 'customer_address']);
});

test('it creates order from cart items', function () {
    $product = Product::factory()->create(['price' => 100000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => $product->price,
    ]);

    $response = $this->post(route('checkout.store'), [
        'customer_name' => 'John Doe',
        'customer_phone' => '08123456789',
        'customer_address' => 'Jl. Test No. 1, Jakarta',
        'notes' => 'Tolong packing rapi',
    ]);

    $order = Order::latest()->first();

    $response->assertRedirect(route('checkout.success', $order));

    expect($order)->not->toBeNull();
    expect($order->customer_name)->toBe('John Doe');
    expect($order->customer_phone)->toBe('08123456789');
    expect($order->status)->toBe('pending');
    expect($order->items)->toHaveCount(1);
    expect((float) $order->total)->toBe(200000.00);
});

test('it clears cart after successful checkout', function () {
    $product = Product::factory()->create(['price' => 50000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price,
    ]);

    $this->post(route('checkout.store'), [
        'customer_name' => 'Jane Doe',
        'customer_phone' => '08123456789',
        'customer_address' => 'Jl. Test No. 2, Bandung',
    ]);

    $cart->refresh();
    expect($cart->items)->toHaveCount(0);
});

test('it decrements product stock after checkout', function () {
    $product = Product::factory()->create(['price' => 75000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'price' => $product->price,
    ]);

    $this->post(route('checkout.store'), [
        'customer_name' => 'Bob Smith',
        'customer_phone' => '08123456789',
        'customer_address' => 'Jl. Test No. 3, Surabaya',
    ]);

    $product->refresh();
    expect($product->stock)->toBe(7);
});

test('guest checkout works without login', function () {
    $product = Product::factory()->create(['price' => 50000, 'stock' => 10]);
    $cart = Cart::factory()->create(['session_id' => session()->getId()]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price,
    ]);

    $response = $this->post(route('checkout.store'), [
        'customer_name' => 'Guest User',
        'customer_phone' => '08111111111',
        'customer_address' => 'Alamat Guest',
    ]);

    $order = Order::latest()->first();

    $response->assertRedirect(route('checkout.success', $order));
    expect($order->user_id)->toBeNull();
});

test('logged in user checkout associates order with user', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50000, 'stock' => 10]);
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price,
    ]);

    $response = $this->actingAs($user)
        ->post(route('checkout.store'), [
            'customer_name' => $user->name,
            'customer_phone' => '08222222222',
            'customer_address' => 'Alamat User',
        ]);

    $order = Order::latest()->first();

    $response->assertRedirect(route('checkout.success', $order));
    expect($order->user_id)->toBe($user->id);
});
