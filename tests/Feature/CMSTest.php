<?php

use App\Models\ContentPage;
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

describe('CMS Content Pages', function () {
    it('can view content pages list', function () {
        ContentPage::factory()->count(3)->create();

        $this->actingAs($this->admin)
            ->get('/admin/cms/pages')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page
                ->component('admin/cms/pages/index')
                ->has('pages', 3)
            );
    });

    it('can edit content page', function () {
        $page = ContentPage::factory()->create();

        $this->actingAs($this->admin)
            ->get("/admin/cms/pages/{$page->id}/edit")
            ->assertSuccessful()
            ->assertInertia(fn ($p) => $p
                ->component('admin/cms/pages/edit')
                ->has('page')
            );
    });

    it('can update content page', function () {
        $page = ContentPage::factory()->create([
            'title' => 'Original Title',
            'content' => '<p>Original content</p>',
        ]);

        $this->actingAs($this->admin)
            ->put("/admin/cms/pages/{$page->id}", [
                'title' => 'Updated Title',
                'content' => '<p>Updated content</p>',
                'meta_description' => 'Updated description',
                'is_active' => true,
            ])
            ->assertRedirect();

        $page->refresh();
        expect($page->title)->toBe('Updated Title');
        expect($page->content)->toBe('<p>Updated content</p>');
        expect($page->meta_description)->toBe('Updated description');
    });

    it('validates required fields when updating page', function () {
        $page = ContentPage::factory()->create();

        $this->actingAs($this->admin)
            ->put("/admin/cms/pages/{$page->id}", [
                'title' => '',
                'content' => '',
            ])
            ->assertSessionHasErrors(['title', 'content']);
    });
});

describe('Storefront Pages', function () {
    it('can view static page on storefront', function () {
        $page = ContentPage::factory()->create([
            'slug' => 'about-us',
            'is_active' => true,
        ]);

        $this->get('/page/about-us')
            ->assertSuccessful()
            ->assertInertia(fn ($p) => $p
                ->component('storefront/pages/show')
                ->has('page')
            );
    });

    it('returns 404 for inactive page', function () {
        ContentPage::factory()->create([
            'slug' => 'hidden-page',
            'is_active' => false,
        ]);

        $this->get('/page/hidden-page')
            ->assertNotFound();
    });

    it('returns 404 for non-existent page', function () {
        $this->get('/page/non-existent')
            ->assertNotFound();
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
