<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
     * Display about us CMS settings.
     */
    public function aboutUs(): Response
    {
        $aboutUsSettings = Setting::where('group', 'about_us')->get()->keyBy('key');

        return Inertia::render('admin/cms/about-us', [
            'settings' => $aboutUsSettings,
        ]);
    }

    /**
     * Update about us CMS settings.
     */
    public function updateAboutUs(Request $request): RedirectResponse
    {
        $data = $request->validate([
            // Hero Section
            'about_us_hero_badge' => 'nullable|string|max:255',
            'about_us_hero_title' => 'nullable|string|max:255',
            'about_us_hero_description' => 'nullable|string|max:1000',
            // Stats Section
            'about_us_stats' => 'nullable|array',
            'about_us_stats.*.value' => 'required|string|max:50',
            'about_us_stats.*.label' => 'required|string|max:100',
            // Vision Section
            'about_us_vision_title' => 'nullable|string|max:255',
            'about_us_vision_description' => 'nullable|string|max:1000',
            // Mission Section
            'about_us_mission_title' => 'nullable|string|max:255',
            'about_us_mission_items' => 'nullable|array',
            'about_us_mission_items.*' => 'required|string|max:255',
            // Values Section
            'about_us_values_title' => 'nullable|string|max:255',
            'about_us_values_description' => 'nullable|string|max:500',
            'about_us_values' => 'nullable|array',
            'about_us_values.*.icon' => 'required|string',
            'about_us_values.*.title' => 'required|string|max:100',
            'about_us_values.*.description' => 'required|string|max:255',
            // Features Section
            'about_us_features_title' => 'nullable|string|max:255',
            'about_us_features_description' => 'nullable|string|max:500',
            'about_us_features' => 'nullable|array',
            'about_us_features.*.icon' => 'required|string',
            'about_us_features.*.title' => 'required|string|max:100',
            'about_us_features.*.description' => 'required|string|max:255',
            // CTA Section
            'about_us_cta_title' => 'nullable|string|max:255',
            'about_us_cta_description' => 'nullable|string|max:500',
            'about_us_cta_button_text' => 'nullable|string|max:100',
        ]);

        $jsonFields = [
            'about_us_stats',
            'about_us_mission_items',
            'about_us_values',
            'about_us_features',
        ];

        foreach ($data as $key => $value) {
            if (in_array($key, $jsonFields)) {
                $value = json_encode($value);
            }
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return redirect()->back()->with('success', 'About Us settings updated successfully.');
    }

    /**
     * Display privacy policy CMS settings.
     */
    public function privacyPolicy(): Response
    {
        $privacyPolicySettings = Setting::where('group', 'privacy_policy')->get()->keyBy('key');

        return Inertia::render('admin/cms/privacy-policy', [
            'settings' => $privacyPolicySettings,
        ]);
    }

    /**
     * Update privacy policy CMS settings.
     */
    public function updatePrivacyPolicy(Request $request): RedirectResponse
    {
        $data = $request->validate([
            // Hero Section
            'privacy_policy_hero_title' => 'nullable|string|max:255',
            'privacy_policy_hero_description' => 'nullable|string|max:500',
            'privacy_policy_last_updated' => 'nullable|date',
            // Sections
            'privacy_policy_sections' => 'nullable|array',
            'privacy_policy_sections.*.id' => 'required|string|max:50',
            'privacy_policy_sections.*.icon' => 'required|string|max:50',
            'privacy_policy_sections.*.title' => 'required|string|max:255',
            'privacy_policy_sections.*.content' => 'required|string',
            // Footer Note
            'privacy_policy_footer_note' => 'nullable|string|max:1000',
        ]);

        $jsonFields = [
            'privacy_policy_sections',
        ];

        foreach ($data as $key => $value) {
            if (in_array($key, $jsonFields)) {
                $value = json_encode($value);
            }
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return redirect()->back()->with('success', 'Privacy Policy settings updated successfully.');
    }
}
