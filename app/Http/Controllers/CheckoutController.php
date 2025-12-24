<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function create(): Response|RedirectResponse
    {
        $cart = Cart::current();
        $cart->load(['items.product.media' => fn ($q) => $q->where('is_primary', true)]);

        // Redirect back if cart is empty
        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang belanja kosong.');
        }

        return Inertia::render('storefront/checkout/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Process the checkout and create an order.
     */
    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $cart = Cart::current();
        $cart->load('items.product');

        // Validate cart is not empty
        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang belanja kosong.');
        }

        // Calculate totals
        $subtotal = $cart->total_price;
        $shippingCost = 0; // Can be calculated based on address in the future
        $total = $subtotal + $shippingCost;

        // Create order
        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => Order::generateOrderNumber(),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $request->customer_address,
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        // Create order items and update stock
        foreach ($cart->items as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_price' => $item->price,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
            ]);

            // Decrease stock
            $item->product->decrement('stock', $item->quantity);
        }

        // Clear the cart
        $cart->items()->delete();

        // Generate WhatsApp message
        $whatsappNumber = '6281224242608';
        $message = $this->generateWhatsAppMessage($order);
        $whatsappUrl = 'https://wa.me/'.$whatsappNumber.'?text='.urlencode($message);

        return redirect()->route('checkout.success', $order)
            ->with('whatsapp_url', $whatsappUrl);
    }

    /**
     * Display the order success page.
     */
    public function success(Order $order): Response
    {
        $order->load('items');

        return Inertia::render('storefront/checkout/success', [
            'order' => $order,
            'whatsapp_url' => session('whatsapp_url'),
        ]);
    }

    /**
     * Generate WhatsApp message for order notification.
     */
    private function generateWhatsAppMessage(Order $order): string
    {
        $order->load('items');

        $message = "🛒 *PESANAN BARU*\n\n";
        $message .= "📋 *No. Pesanan:* #{$order->order_number}\n\n";
        $message .= "👤 *Data Pelanggan:*\n";
        $message .= "Nama: {$order->customer_name}\n";
        $message .= "Telepon: {$order->customer_phone}\n";
        if ($order->customer_email) {
            $message .= "Email: {$order->customer_email}\n";
        }
        $message .= "Alamat: {$order->customer_address}\n\n";

        $message .= "📦 *Detail Pesanan:*\n";
        foreach ($order->items as $item) {
            $message .= "• {$item->product_name} x{$item->quantity} = Rp ".number_format($item->subtotal, 0, ',', '.')."\n";
        }
        $message .= "\n";
        $message .= '💰 *Total:* Rp '.number_format((float) $order->total, 0, ',', '.')."\n\n";

        if ($order->notes) {
            $message .= "📝 *Catatan:* {$order->notes}\n\n";
        }

        $message .= 'Terima kasih telah berbelanja! 🙏';

        return $message;
    }
}
