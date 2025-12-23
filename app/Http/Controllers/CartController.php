<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(): Response
    {
        $cart = Cart::current();
        $cart->load(['items.product.media' => fn ($q) => $q->where('is_primary', true)]);

        return Inertia::render('storefront/cart/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function add(AddToCartRequest $request): RedirectResponse
    {
        $product = Product::findOrFail($request->product_id);

        // Check if product is active and in stock
        if (! $product->is_active) {
            return back()->withErrors(['product_id' => 'Produk tidak tersedia.']);
        }

        if ($product->stock <= 0) {
            return back()->withErrors(['product_id' => 'Stok produk habis.']);
        }

        $cart = Cart::current();

        // Check if product already in cart
        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        $requestedQuantity = $request->quantity;
        $currentQuantity = $existingItem ? $existingItem->quantity : 0;
        $totalQuantity = $currentQuantity + $requestedQuantity;

        // Check stock availability
        if ($totalQuantity > $product->stock) {
            return back()->withErrors([
                'quantity' => "Stok tidak mencukupi. Tersedia: {$product->stock}, di keranjang: {$currentQuantity}.",
            ]);
        }

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $totalQuantity,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $requestedQuantity,
                'price' => $product->price,
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        // Verify the cart item belongs to current cart
        $cart = Cart::current();
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $product = $cartItem->product;

        // Check stock availability
        if ($request->quantity > $product->stock) {
            return back()->withErrors([
                'quantity' => "Stok tidak mencukupi. Tersedia: {$product->stock}.",
            ]);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back()->with('success', 'Jumlah berhasil diperbarui.');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(CartItem $cartItem): RedirectResponse
    {
        // Verify the cart item belongs to current cart
        $cart = Cart::current();
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Produk berhasil dihapus dari keranjang.');
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(): RedirectResponse
    {
        $cart = Cart::current();
        $cart->items()->delete();

        return back()->with('success', 'Keranjang berhasil dikosongkan.');
    }

    /**
     * Get cart count for header badge.
     */
    public function count(): JsonResponse
    {
        $cart = Cart::current();

        return response()->json([
            'count' => $cart->total_items,
        ]);
    }
}
