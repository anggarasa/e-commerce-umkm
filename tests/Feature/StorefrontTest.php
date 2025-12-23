<?php

use App\Models\Category;
use App\Models\Product;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Create test categories
    $this->category = Category::factory()->create([
        'name' => 'Elektronik',
        'slug' => 'elektronik',
        'is_active' => true,
    ]);

    $this->inactiveCategory = Category::factory()->create([
        'name' => 'Arsip',
        'slug' => 'arsip',
        'is_active' => false,
    ]);

    // Create test products
    $this->product = Product::factory()->create([
        'name' => 'Laptop Gaming',
        'slug' => 'laptop-gaming',
        'price' => 15000000,
        'stock' => 10,
        'is_active' => true,
        'category_id' => $this->category->id,
    ]);

    $this->inactiveProduct = Product::factory()->create([
        'name' => 'Produk Nonaktif',
        'slug' => 'produk-nonaktif',
        'is_active' => false,
        'category_id' => $this->category->id,
    ]);

    $this->outOfStockProduct = Product::factory()->create([
        'name' => 'Produk Habis',
        'slug' => 'produk-habis',
        'stock' => 0,
        'is_active' => true,
        'category_id' => $this->category->id,
    ]);
});

describe('Homepage', function () {
    it('can access homepage', function () {
        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page->component('welcome'));
    });

    it('shows featured products on homepage', function () {
        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('featuredProducts')
            ->has('featuredCategories')
        );
    });

    it('only shows active products in featured products', function () {
        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->where('featuredProducts', fn ($products) => collect($products)->every(fn ($p) => $p['is_active'] === true)
            )
        );
    });
});

describe('Products Catalog', function () {
    it('can access products catalog page', function () {
        $response = $this->get('/products');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page->component('storefront/products/index'));
    });

    it('shows products list with pagination', function () {
        $response = $this->get('/products');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/index')
            ->has('products.data')
            ->has('categories')
            ->has('filters')
        );
    });

    it('only shows active products in catalog', function () {
        $response = $this->get('/products');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->has('products.data')
            ->where('products.data', fn ($products) => collect($products)->every(fn ($p) => $p['is_active'] === true)
            )
        );
    });

    it('can search products by name', function () {
        $response = $this->get('/products?search=Laptop');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/index')
            ->has('filters.search')
            ->where('filters.search', 'Laptop')
        );
    });

    it('can filter products by category', function () {
        $response = $this->get('/products?category=elektronik');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/index')
            ->where('filters.category', 'elektronik')
        );
    });

    it('can filter products by price range', function () {
        $response = $this->get('/products?min_price=10000000&max_price=20000000');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/index')
            ->where('filters.min_price', '10000000')
            ->where('filters.max_price', '20000000')
        );
    });

    it('can sort products', function () {
        $response = $this->get('/products?sort=price_asc');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/index')
            ->where('filters.sort', 'price_asc')
        );
    });
});

describe('Product Detail', function () {
    it('can access product detail page', function () {
        $response = $this->get("/products/{$this->product->slug}");

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/products/show')
            ->has('product')
            ->where('product.id', $this->product->id)
        );
    });

    it('shows related products on product detail page', function () {
        $response = $this->get("/products/{$this->product->slug}");

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->has('relatedProducts')
        );
    });

    it('returns 404 for inactive product', function () {
        $response = $this->get("/products/{$this->inactiveProduct->slug}");

        $response->assertNotFound();
    });

    it('returns 404 for non-existent product', function () {
        $response = $this->get('/products/non-existent-product');

        $response->assertNotFound();
    });
});

describe('Category Page', function () {
    it('can access category page', function () {
        $response = $this->get("/category/{$this->category->slug}");

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/categories/show')
            ->has('category')
            ->has('products.data')
        );
    });

    it('shows only products from the category', function () {
        $otherCategory = Category::factory()->create(['is_active' => true]);
        Product::factory()->create([
            'category_id' => $otherCategory->id,
            'is_active' => true,
        ]);

        $response = $this->get("/category/{$this->category->slug}");

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->has('products.data')
            ->where('products.data', fn ($products) => collect($products)->every(fn ($p) => $p['category_id'] === $this->category->id
                )
            )
        );
    });

    it('returns 404 for inactive category', function () {
        $response = $this->get("/category/{$this->inactiveCategory->slug}");

        $response->assertNotFound();
    });

    it('returns 404 for non-existent category', function () {
        $response = $this->get('/category/non-existent-category');

        $response->assertNotFound();
    });
});

describe('Route Registration', function () {
    it('redirects register route to home', function () {
        $response = $this->get('/register');

        $response->assertRedirect('/');
    });
});
