<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    /**
     * Get categories for layout.
     */
    private function getCategories()
    {
        return Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->with(['children' => fn ($q) => $q->where('is_active', true)->withCount(['products' => fn ($q) => $q->where('is_active', true)])])
            ->orderBy('name')
            ->get()
            ->each(function ($category) {
                $category->products_count += $category->children->sum('products_count');
            });
    }

    /**
     * Display the About Us page.
     */
    public function aboutUs(): Response
    {
        $aboutUsSettings = Setting::where('group', 'about_us')->get()->keyBy('key');

        return Inertia::render('storefront/about-us', [
            'categories' => $this->getCategories(),
            'aboutUsSettings' => $aboutUsSettings,
        ]);
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacyPolicy(): Response
    {
        $privacyPolicySettings = Setting::where('group', 'privacy_policy')->get()->keyBy('key');

        return Inertia::render('storefront/privacy-policy', [
            'categories' => $this->getCategories(),
            'privacyPolicySettings' => $privacyPolicySettings,
        ]);
    }

    /**
     * Display the Terms of Service page.
     */
    public function termsOfService(): Response
    {
        return Inertia::render('storefront/terms-of-service', [
            'categories' => $this->getCategories(),
        ]);
    }
}
