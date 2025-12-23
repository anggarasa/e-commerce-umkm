<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->category = Category::factory()->create([
        'is_active' => true,
    ]);

    $this->product = Product::factory()->create([
        'name' => 'Test Product',
        'slug' => 'test-product',
        'price' => 100000,
        'stock' => 10,
        'is_active' => true,
        'category_id' => $this->category->id,
    ]);

    $this->outOfStockProduct = Product::factory()->create([
        'name' => 'Out of Stock Product',
        'slug' => 'out-of-stock-product',
        'price' => 50000,
        'stock' => 0,
        'is_active' => true,
        'category_id' => $this->category->id,
    ]);
});

describe('Cart Page', function () {
    it('can access cart page', function () {
        $response = $this->get('/cart');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page->component('storefront/cart/index'));
    });

    it('shows empty cart initially', function () {
        $response = $this->get('/cart');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/cart/index')
            ->has('cart')
            ->where('cart.total_items', 0)
            ->where('cart.total_price', 0)
        );
    });
});

describe('Add to Cart', function () {
    it('can add product to cart', function () {
        $response = $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $response->assertRedirect();

        $cart = Cart::current();
        expect($cart->items)->toHaveCount(1);
        expect($cart->items->first()->quantity)->toBe(2);
        expect($cart->items->first()->product_id)->toBe($this->product->id);
    });

    it('increases quantity when adding same product', function () {
        // Add first time
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        // Add second time
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 3,
        ]);

        $cart = Cart::current();
        expect($cart->items)->toHaveCount(1);
        expect($cart->items->first()->quantity)->toBe(5);
    });

    it('cannot add out of stock product', function () {
        $response = $this->post('/cart/add', [
            'product_id' => $this->outOfStockProduct->id,
            'quantity' => 1,
        ]);

        $response->assertSessionHasErrors(['product_id']);

        $cart = Cart::current();
        expect($cart->items)->toHaveCount(0);
    });

    it('cannot add quantity exceeding stock', function () {
        $response = $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 100, // More than available stock
        ]);

        $response->assertSessionHasErrors(['quantity']);
    });

    it('validates product_id is required', function () {
        $response = $this->post('/cart/add', [
            'quantity' => 1,
        ]);

        $response->assertSessionHasErrors(['product_id']);
    });

    it('validates quantity is required', function () {
        $response = $this->post('/cart/add', [
            'product_id' => $this->product->id,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    });

    it('validates quantity is at least 1', function () {
        $response = $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 0,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    });
});

describe('Update Cart Item', function () {
    it('can update cart item quantity', function () {
        // Add item first
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $cart = Cart::current();
        $cartItem = $cart->items->first();

        $response = $this->patch("/cart/{$cartItem->id}", [
            'quantity' => 5,
        ]);

        $response->assertRedirect();

        $cartItem->refresh();
        expect($cartItem->quantity)->toBe(5);
    });

    it('cannot update quantity exceeding stock', function () {
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $cart = Cart::current();
        $cartItem = $cart->items->first();

        $response = $this->patch("/cart/{$cartItem->id}", [
            'quantity' => 100,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    });
});

describe('Remove Cart Item', function () {
    it('can remove item from cart', function () {
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $cart = Cart::current();
        $cartItem = $cart->items->first();

        $response = $this->delete("/cart/{$cartItem->id}");

        $response->assertRedirect();

        $cart->refresh();
        $cart->load('items');
        expect($cart->items)->toHaveCount(0);
    });
});

describe('Clear Cart', function () {
    it('can clear all items from cart', function () {
        // Add multiple items
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $product2 = Product::factory()->create([
            'stock' => 5,
            'is_active' => true,
            'category_id' => $this->category->id,
        ]);

        $this->post('/cart/add', [
            'product_id' => $product2->id,
            'quantity' => 1,
        ]);

        $cart = Cart::current();
        expect($cart->items)->toHaveCount(2);

        $response = $this->delete('/cart');

        $response->assertRedirect();

        $cart->refresh();
        $cart->load('items');
        expect($cart->items)->toHaveCount(0);
    });
});

describe('Cart Count', function () {
    it('returns cart count as json', function () {
        $this->post('/cart/add', [
            'product_id' => $this->product->id,
            'quantity' => 3,
        ]);

        $response = $this->getJson('/cart/count');

        $response->assertSuccessful();
        $response->assertJson(['count' => 3]);
    });
});
