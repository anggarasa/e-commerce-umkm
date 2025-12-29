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
});
