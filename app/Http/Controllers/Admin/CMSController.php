<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CMSController extends Controller
{
    /**
     * Display homepage CMS settings.
     */
    public function homepage(): Response
    {
        $homepageSettings = Setting::where('group', 'homepage')->get()->keyBy('key');

        return Inertia::render('admin/cms/homepage', [
            'settings' => $homepageSettings,
        ]);
    }

    /**
     * Update homepage CMS settings.
     */
    public function updateHomepage(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'hero_badge' => 'nullable|string|max:255',
            'hero_title' => 'nullable|string|max:500',
            'hero_description' => 'nullable|string|max:1000',
            'hero_cta_primary' => 'nullable|string|max:100',
            'hero_cta_secondary' => 'nullable|string|max:100',
            'features' => 'nullable|array',
            'features.*.icon' => 'required|string',
            'features.*.title' => 'required|string|max:100',
            'features.*.description' => 'required|string|max:255',
            'cta_title' => 'nullable|string|max:255',
            'cta_description' => 'nullable|string|max:1000',
            'cta_button_text' => 'nullable|string|max:100',
        ]);

        foreach ($data as $key => $value) {
            if ($key === 'features') {
                $value = json_encode($value);
            }
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return redirect()->back()->with('success', 'Homepage settings updated successfully.');
    }

    /**
     * Display list of content pages.
     */
    public function pages(): Response
    {
        $pages = ContentPage::orderBy('title')->get();

        return Inertia::render('admin/cms/pages/index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Edit a content page.
     */
    public function editPage(ContentPage $contentPage): Response
    {
        return Inertia::render('admin/cms/pages/edit', [
            'page' => $contentPage,
        ]);
    }

    /**
     * Update a content page.
     */
    public function updatePage(Request $request, ContentPage $contentPage): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $contentPage->update($data);

        return redirect()->back()->with('success', 'Page updated successfully.');
    }
}
