<?php

use App\Models\Setting;
use App\Models\User;

beforeEach(function () {
    // Create admin user
    $this->admin = User::factory()->create();
});

describe('CMS Homepage Settings', function () {
    it('can view homepage settings page', function () {
        $this->actingAs($this->admin)
            ->get('/admin/cms/homepage')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('admin/cms/homepage'));
    });

    it('can update homepage settings', function () {
        // Create or update homepage settings
        Setting::updateOrCreate(['key' => 'hero_badge'], ['value' => 'Original Badge', 'type' => 'string', 'group' => 'homepage']);
        Setting::updateOrCreate(['key' => 'hero_title'], ['value' => 'Original Title', 'type' => 'string', 'group' => 'homepage']);

        $this->actingAs($this->admin)
            ->put('/admin/cms/homepage', [
                'hero_badge' => 'Updated Badge',
                'hero_title' => 'Updated Title',
            ])
            ->assertRedirect();

        expect(Setting::where('key', 'hero_badge')->first()->value)->toBe('Updated Badge');
        expect(Setting::where('key', 'hero_title')->first()->value)->toBe('Updated Title');
    });

    it('requires authentication to access CMS', function () {
        $this->get('/admin/cms/homepage')
            ->assertRedirect('/login');
    });
});

describe('CMS About Us Settings', function () {
    it('can view about us CMS settings page', function () {
        $this->actingAs($this->admin)
            ->get('/admin/cms/about-us')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('admin/cms/about-us'));
    });

    it('can update about us settings', function () {
        // Create or update about us settings
        Setting::updateOrCreate(['key' => 'about_us_hero_badge'], ['value' => 'Original Badge', 'type' => 'string', 'group' => 'about_us']);
        Setting::updateOrCreate(['key' => 'about_us_hero_title'], ['value' => 'Original Title', 'type' => 'string', 'group' => 'about_us']);

        $this->actingAs($this->admin)
            ->put('/admin/cms/about-us', [
                'about_us_hero_badge' => 'Updated Badge',
                'about_us_hero_title' => 'Updated Title',
            ])
            ->assertRedirect();

        expect(Setting::where('key', 'about_us_hero_badge')->first()->value)->toBe('Updated Badge');
        expect(Setting::where('key', 'about_us_hero_title')->first()->value)->toBe('Updated Title');
    });

    it('requires authentication to access about us CMS', function () {
        $this->get('/admin/cms/about-us')
            ->assertRedirect('/login');
    });
});

describe('Static Pages', function () {
    it('can view about us page', function () {
        $this->get('/about-us')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('storefront/about-us'));
    });

    it('can view privacy policy page', function () {
        $this->get('/privacy-policy')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('storefront/privacy-policy'));
    });

    it('can view terms of service page', function () {
        $this->get('/terms-of-service')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('storefront/terms-of-service'));
    });

    it('homepage displays with homepage settings', function () {
        Setting::updateOrCreate(['key' => 'hero_badge'], ['value' => 'Test Badge', 'type' => 'string', 'group' => 'homepage']);

        $this->get('/')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('welcome')
                ->has('homepageSettings')
            );
    });

    it('about us page displays with CMS settings', function () {
        Setting::updateOrCreate(['key' => 'about_us_hero_badge'], ['value' => 'Test Badge', 'type' => 'string', 'group' => 'about_us']);

        $this->get('/about-us')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('storefront/about-us')
                ->has('aboutUsSettings')
            );
    });

    it('privacy policy page displays with CMS settings', function () {
        Setting::updateOrCreate(['key' => 'privacy_policy_hero_title'], ['value' => 'Test Title', 'type' => 'string', 'group' => 'privacy_policy']);

        $this->get('/privacy-policy')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('storefront/privacy-policy')
                ->has('privacyPolicySettings')
            );
    });

    it('terms of service page displays with CMS settings', function () {
        Setting::updateOrCreate(['key' => 'terms_of_service_hero_title'], ['value' => 'Test Title', 'type' => 'string', 'group' => 'terms_of_service']);

        $this->get('/terms-of-service')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('storefront/terms-of-service')
                ->has('termsOfServiceSettings')
            );
    });
});

describe('CMS Terms of Service Settings', function () {
    it('can view terms of service CMS settings page', function () {
        $this->actingAs($this->admin)
            ->get('/admin/cms/terms-of-service')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('admin/cms/terms-of-service'));
    });

    it('can update terms of service settings', function () {
        // Create or update terms of service settings
        Setting::updateOrCreate(['key' => 'terms_of_service_hero_title'], ['value' => 'Original Title', 'type' => 'string', 'group' => 'terms_of_service']);
        Setting::updateOrCreate(['key' => 'terms_of_service_hero_description'], ['value' => 'Original Description', 'type' => 'string', 'group' => 'terms_of_service']);

        $this->actingAs($this->admin)
            ->put('/admin/cms/terms-of-service', [
                'terms_of_service_hero_title' => 'Updated Title',
                'terms_of_service_hero_description' => 'Updated Description',
            ])
            ->assertRedirect();

        expect(Setting::where('key', 'terms_of_service_hero_title')->first()->value)->toBe('Updated Title');
        expect(Setting::where('key', 'terms_of_service_hero_description')->first()->value)->toBe('Updated Description');
    });

    it('requires authentication to access terms of service CMS', function () {
        $this->get('/admin/cms/terms-of-service')
            ->assertRedirect('/login');
    });
});
