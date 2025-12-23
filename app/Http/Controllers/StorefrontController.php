<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    /**
     * Homepage with featured products and categories.
     */
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->with(['category', 'media' => fn ($q) => $q->where('is_primary', true)])
            ->latest()
            ->take(8)
            ->get();

        $featuredCategories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->take(6)
            ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'featuredCategories' => $featuredCategories,
        ]);
    }

    /**
     * Product catalog with filters and pagination.
     */
    public function products(Request $request): Response
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['category', 'media' => fn ($q) => $q->where('is_primary', true)]);

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        // Price range filter
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        $query = match ($sort) {
            'oldest' => $query->oldest(),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return Inertia::render('storefront/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search'),
                'category' => $request->input('category'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Product detail page.
     */
    public function productDetail(Product $product): Response
    {
        if (! $product->is_active) {
            abort(404);
        }

        $product->load(['category', 'media']);

        // Get related products from the same category
        $relatedProducts = Product::query()
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['media' => fn ($q) => $q->where('is_primary', true)])
            ->take(4)
            ->get();

        return Inertia::render('storefront/products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Category page with products.
     */
    public function category(Category $category): Response
    {
        if (! $category->is_active) {
            abort(404);
        }

        $category->load(['children' => fn ($q) => $q->where('is_active', true)]);

        // Get products from this category and its children
        $categoryIds = collect([$category->id])
            ->merge($category->children->pluck('id'));

        $products = Product::query()
            ->where('is_active', true)
            ->whereIn('category_id', $categoryIds)
            ->with(['category', 'media' => fn ($q) => $q->where('is_primary', true)])
            ->latest()
            ->paginate(12);

        return Inertia::render('storefront/categories/show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}
