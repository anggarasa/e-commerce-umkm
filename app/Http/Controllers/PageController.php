<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ContentPage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a content page by slug.
     */
    public function show(string $slug): Response
    {
        $page = ContentPage::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $categories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->with(['children' => fn ($q) => $q->where('is_active', true)->withCount(['products' => fn ($q) => $q->where('is_active', true)])])
            ->orderBy('name')
            ->get();

        // Calculate total products recursively
        $categories->each(function ($category) {
            $category->products_count += $category->children->sum('products_count');
        });

        return Inertia::render('storefront/pages/show', [
            'page' => $page,
            'categories' => $categories,
        ]);
    }
}
