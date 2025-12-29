<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Services\AdminNotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page (from cart).
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
            'directProduct' => null,
            'shippingCost' => (int) Setting::where('key', 'shipping_cost')->value('value') ?? 0,
        ]);
    }

    /**
     * Display the checkout page for a single product (Buy Now).
     */
    public function createFromProduct(Product $product, Request $request): Response|RedirectResponse
    {
        $quantity = max(1, (int) $request->query('quantity', 1));

        // Validate stock
        if ($product->stock <= 0) {
            return redirect()->route('products.show', $product)
                ->with('error', 'Produk tidak tersedia.');
        }

        if ($quantity > $product->stock) {
            $quantity = $product->stock;
        }

        $product->load(['media' => fn ($q) => $q->where('is_primary', true)]);

        $directProduct = [
            'product' => $product,
            'quantity' => $quantity,
            'price' => $product->price,
            'subtotal' => $product->price * $quantity,
        ];

        return Inertia::render('storefront/checkout/index', [
            'cart' => null,
            'directProduct' => $directProduct,
            'shippingCost' => (int) Setting::where('key', 'shipping_cost')->value('value') ?? 0,
        ]);
    }

    /**
     * Process the checkout and create an order.
     */
    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $items = [];
        $subtotal = 0;

        // Check if this is a direct product checkout
        if ($request->has('product_id')) {
            $product = Product::findOrFail($request->product_id);
            $quantity = max(1, (int) $request->quantity);

            // Validate stock
            if ($product->stock < $quantity) {
                return back()->with('error', 'Stok produk tidak mencukupi.');
            }

            $items[] = [
                'product' => $product,
                'quantity' => $quantity,
                'price' => $product->price,
                'subtotal' => $product->price * $quantity,
            ];
            $subtotal = $product->price * $quantity;
        } else {
            // Cart-based checkout
            $cart = Cart::current();
            $cart->load('items.product');

            if ($cart->items->isEmpty()) {
                return redirect()->route('cart.index')
                    ->with('error', 'Keranjang belanja kosong.');
            }

            foreach ($cart->items as $item) {
                $items[] = [
                    'product' => $item->product,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ];
            }
            $subtotal = $cart->total_price;
        }

        // Calculate totals
        $shippingCost = (int) Setting::where('key', 'shipping_cost')->value('value') ?? 0;
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
        foreach ($items as $item) {
            $order->items()->create([
                'product_id' => $item['product']->id,
                'product_name' => $item['product']->name,
                'product_price' => $item['price'],
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal'],
            ]);

            // Decrease stock
            $item['product']->decrement('stock', $item['quantity']);
        }

        // Clear cart if this was a cart checkout
        if (! $request->has('product_id')) {
            $cart = Cart::current();
            $cart->items()->delete();
        }

        // Create admin notification for new order
        app(AdminNotificationService::class)->notifyNewOrder($order);

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
