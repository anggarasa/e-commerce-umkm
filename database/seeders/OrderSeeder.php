<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing products
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');

            return;
        }

        // Get existing users or create some
        $users = User::where('role', 'customer')->get();

        if ($users->isEmpty()) {
            $users = User::factory(5)->create(['role' => 'customer']);
        }

        // Create 30 orders with varied dates
        for ($i = 0; $i < 30; $i++) {
            $createdAt = now()->subDays(rand(0, 30))->subHours(rand(0, 23));

            $order = Order::factory()->create([
                'user_id' => fake()->boolean(70) ? $users->random()->id : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Add 1-4 random items per order
            $itemCount = rand(1, 4);
            $selectedProducts = $products->random(min($itemCount, $products->count()));
            $subtotal = 0;

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 3);
                $itemSubtotal = $product->price * $quantity;
                $subtotal += $itemSubtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => $itemSubtotal,
                ]);
            }

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'total' => $subtotal + $order->shipping_cost,
            ]);
        }

        $this->command->info('Created 30 dummy orders successfully!');
    }
}
