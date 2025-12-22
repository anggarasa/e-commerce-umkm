<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_product_list()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.products.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/index')
            ->has('products.data', 1)
        );
    }

    public function test_admin_can_create_product_with_image()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $file = UploadedFile::fake()->image('product.jpg');

        $response = $this->actingAs($user)->post(route('admin.products.store'), [
            'name' => 'Test Product',
            'slug' => 'test-product',
            'category_id' => $category->id,
            'price' => 150000,
            'stock' => 10,
            'description' => 'Desc',
            'is_active' => true,
            'new_media' => [
                [
                    'file' => $file,
                    'type' => 'image',
                    'is_primary' => true,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', ['slug' => 'test-product']);

        $product = Product::where('slug', 'test-product')->first();
        $this->assertCount(1, $product->media);
        $this->assertEquals('image', $product->media->first()->type);
        Storage::disk('public')->assertExists($product->media->first()->path);
    }

    public function test_admin_can_view_product_detail(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.products.show', $product->id));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/show')
            ->has('product')
            ->where('product.id', $product->id)
        );
    }

    public function test_admin_can_create_product_with_video()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $file = UploadedFile::fake()->create('product.mp4', 1000, 'video/mp4');

        $response = $this->actingAs($user)->post(route('admin.products.store'), [
            'name' => 'Test Product Video',
            'slug' => 'test-product-video',
            'category_id' => $category->id,
            'price' => 150000,
            'stock' => 10,
            'description' => 'Desc',
            'is_active' => true,
            'new_media' => [
                [
                    'file' => $file,
                    'type' => 'video',
                    'is_primary' => true,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', ['slug' => 'test-product-video']);

        $product = Product::where('slug', 'test-product-video')->first();
        $this->assertCount(1, $product->media);
        $this->assertEquals('video', $product->media->first()->type);
        Storage::disk('public')->assertExists($product->media->first()->path);
    }
}
