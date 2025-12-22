<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Elektronik',
                'slug' => 'elektronik',
                'icon' => 'laptop',
                'description' => 'Perangkat elektronik dan gadget',
                'children' => [
                    ['name' => 'Handphone', 'slug' => 'handphone', 'icon' => 'smartphone'],
                    ['name' => 'Laptop', 'slug' => 'laptop', 'icon' => 'laptop'],
                    ['name' => 'Aksesoris', 'slug' => 'aksesoris-elektronik', 'icon' => 'headphones'],
                ],
            ],
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
                'icon' => 'shirt',
                'description' => 'Pakaian dan aksesoris fashion',
                'children' => [
                    ['name' => 'Pakaian Pria', 'slug' => 'pakaian-pria', 'icon' => 'shirt'],
                    ['name' => 'Pakaian Wanita', 'slug' => 'pakaian-wanita', 'icon' => 'shirt'],
                    ['name' => 'Sepatu', 'slug' => 'sepatu', 'icon' => 'footprints'],
                ],
            ],
            [
                'name' => 'Makanan & Minuman',
                'slug' => 'makanan-minuman',
                'icon' => 'utensils',
                'description' => 'Produk makanan dan minuman',
                'children' => [
                    ['name' => 'Makanan Ringan', 'slug' => 'makanan-ringan', 'icon' => 'cookie'],
                    ['name' => 'Minuman', 'slug' => 'minuman', 'icon' => 'cup-soda'],
                ],
            ],
            [
                'name' => 'Kesehatan',
                'slug' => 'kesehatan',
                'icon' => 'heart-pulse',
                'description' => 'Produk kesehatan dan kecantikan',
            ],
            [
                'name' => 'Rumah Tangga',
                'slug' => 'rumah-tangga',
                'icon' => 'home',
                'description' => 'Peralatan dan kebutuhan rumah tangga',
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $parent = Category::create($categoryData);

            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                Category::create($childData);
            }
        }
    }
}
