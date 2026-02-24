<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DateRangeOrderSeeder extends Seeder
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

        $startDate = Carbon::createFromDate(2026, 1, 1)->startOfDay();
        $endDate = Carbon::createFromDate(2026, 2, 23)->endOfDay();

        // Clear previous orders in range to avoid duplicates if re-running
        Order::whereBetween('created_at', [$startDate, $endDate])->delete();

        $totalOrdersCreated = 0;

        for ($date = clone $startDate; $date->lte($endDate); $date->addDay()) {
            // Generate between 1 to 5 orders per day
            $ordersPerDay = rand(1, 5);

            for ($i = 0; $i < $ordersPerDay; $i++) {
                $createdAt = clone $date;
                $createdAt->setTime(rand(8, 22), rand(0, 59), rand(0, 59));

                $order = Order::factory()->create([
                    'user_id' => fake()->boolean(70) ? $users->random()->id : null,
                    'order_number' => 'ORD' . $createdAt->format('Ymd') . strtoupper(substr(uniqid(), -4)) . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                // Add 1-4 random items per order
                $itemCount = rand(1, 4);
                $selectedProducts = $products->random(min($itemCount, $products->count()));
                $subtotal = 0;

                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 4);
                    $itemSubtotal = $product->price * $quantity;
                    $subtotal += $itemSubtotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_price' => $product->price,
                        'quantity' => $quantity,
                        'subtotal' => $itemSubtotal,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                }

                // Update order totals
                $order->update([
                    'subtotal' => $subtotal,
                    'total' => $subtotal + $order->shipping_cost,
                ]);

                $totalOrdersCreated++;
            }
        }

        $this->command->info("Created {$totalOrdersCreated} dummy orders successfully from Jan 1, 2026 to Feb 23, 2026!");
    }
}
