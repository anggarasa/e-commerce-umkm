<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define products for each category
        $productData = [
            // Elektronik - Handphone
            'handphone' => [
                ['name' => 'iPhone 15 Pro Max', 'price' => 21999000, 'stock' => 15, 'description' => 'iPhone terbaru dengan chip A17 Pro, kamera 48MP, dan Dynamic Island. Performa luar biasa untuk gaming dan produktivitas.'],
            ],

            // Elektronik - Laptop
            'laptop' => [
                ['name' => 'MacBook Pro 14" M3 Pro', 'price' => 32999000, 'stock' => 10, 'description' => 'Laptop profesional Apple dengan chip M3 Pro, 18GB RAM, dan display Liquid Retina XDR.'],
            ],

            // Elektronik - Aksesoris
            'aksesoris-elektronik' => [
                ['name' => 'Apple AirPods Pro 2', 'price' => 3999000, 'stock' => 40, 'description' => 'TWS premium dengan ANC adaptive, spatial audio, dan USB-C charging case.'],
            ],

            // Fashion - Pakaian Pria
            'pakaian-pria' => [
                ['name' => 'Kemeja Batik Premium Pekalongan', 'price' => 450000, 'stock' => 50, 'description' => 'Batik tulis Pekalongan dengan motif klasik. Bahan katun premium, nyaman dipakai seharian.'],
            ],

            // Fashion - Pakaian Wanita
            'pakaian-wanita' => [
                ['name' => 'Dress Batik Modern', 'price' => 550000, 'stock' => 45, 'description' => 'Dress batik dengan cutting modern A-line. Cocok untuk acara formal dan casual.'],
            ],

            // Fashion - Sepatu
            'sepatu' => [
                ['name' => 'Nike Air Jordan 1 Retro', 'price' => 2799000, 'stock' => 20, 'description' => 'Sneakers iconic dengan desain classic. Original colorway yang timeless.'],
            ],

            // Makanan & Minuman - Makanan Ringan
            'makanan-ringan' => [
                ['name' => 'Keripik Singkong Pedas Level 5', 'price' => 35000, 'stock' => 150, 'description' => 'Keripik singkong dengan bumbu pedas level ekstrem. Tantangan pecinta pedas!'],
            ],

            // Makanan & Minuman - Minuman
            'minuman' => [
                ['name' => 'Kopi Arabica Toraja 250gr', 'price' => 125000, 'stock' => 70, 'description' => 'Biji kopi arabica single origin dari Toraja. Medium roast dengan notes fruity.'],
            ],

            // Kesehatan
            'kesehatan' => [
                ['name' => 'Vitamin C 1000mg 60 Tablet', 'price' => 185000, 'stock' => 80, 'description' => 'Suplemen vitamin C dosis tinggi. Meningkatkan daya tahan tubuh.'],
            ],

            // Rumah Tangga
            'rumah-tangga' => [
                ['name' => 'Rice Cooker Digital 1.8L', 'price' => 895000, 'stock' => 35, 'description' => 'Rice cooker dengan fuzzy logic technology. Multi cook function untuk berbagai masakan.'],
            ],
        ];

        // Get all categories
        $categories = Category::all()->keyBy('slug');

        $productCount = 0;
        foreach ($productData as $categorySlug => $products) {
            $category = $categories->get($categorySlug);
            if (! $category) {
                $this->command->warn("Category not found: $categorySlug");

                continue;
            }

            foreach ($products as $productInfo) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $productInfo['name'],
                    'slug' => Str::slug($productInfo['name']),
                    'price' => $productInfo['price'],
                    'stock' => $productInfo['stock'],
                    'description' => $productInfo['description'],
                    'is_active' => true,
                ]);
                $productCount++;
            }
        }

        $this->command->info('Created '.$productCount.' products across categories.');

        // Add sample media for some products (optional - commented out if no actual files)
        // Uncomment and modify if you want to generate dummy media records
        /*
        $productsWithMedia = Product::inRandomOrder()->limit(30)->get();
        foreach ($productsWithMedia as $product) {
            $mediaCount = rand(1, 4);
            for ($i = 0; $i < $mediaCount; $i++) {
                ProductMedia::create([
                    'product_id' => $product->id,
                    'path' => 'products/sample-' . $product->id . '-' . $i . '.jpg',
                    'type' => 'image',
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                ]);
            }
        }
        */
    }
}
