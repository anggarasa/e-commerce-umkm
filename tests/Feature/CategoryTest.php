<?php

use App\Models\Category;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

describe('Category Index', function () {
    it('shows categories page for authenticated users', function () {
        $this->actingAs($this->user)
            ->get('/admin/categories')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('admin/categories/index'));
    });

    it('redirects unauthenticated users to login', function () {
        $this->get('/admin/categories')
            ->assertRedirect('/login');
    });

    it('displays categories with children', function () {
        $parent = Category::factory()->create(['name' => 'Elektronik']);
        $child = Category::factory()->create([
            'name' => 'Handphone',
            'parent_id' => $parent->id,
        ]);

        $this->actingAs($this->user)
            ->get('/admin/categories')
            ->assertInertia(fn ($page) => $page
                ->has('categories', 1)
                ->where('categories.0.name', 'Elektronik')
                ->has('categories.0.children', 1)
            );
    });
});

describe('Category Create', function () {
    it('shows create category form', function () {
        $this->actingAs($this->user)
            ->get('/admin/categories/create')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('admin/categories/create'));
    });

    it('can create a category', function () {
        $this->actingAs($this->user)
            ->post('/admin/categories', [
                'name' => 'Kategori Baru',
                'description' => 'Deskripsi kategori',
                'is_active' => true,
            ])
            ->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('categories', [
            'name' => 'Kategori Baru',
            'slug' => 'kategori-baru',
        ]);
    });

    it('auto-generates slug from name', function () {
        $this->actingAs($this->user)
            ->post('/admin/categories', [
                'name' => 'Kategori Dengan Spasi',
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Kategori Dengan Spasi',
            'slug' => 'kategori-dengan-spasi',
        ]);
    });

    it('can create category with parent', function () {
        $parent = Category::factory()->create();

        $this->actingAs($this->user)
            ->post('/admin/categories', [
                'name' => 'Sub Kategori',
                'parent_id' => $parent->id,
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Sub Kategori',
            'parent_id' => $parent->id,
        ]);
    });

    it('validates required name field', function () {
        $this->actingAs($this->user)
            ->post('/admin/categories', [
                'is_active' => true,
            ])
            ->assertSessionHasErrors('name');
    });

    it('validates unique slug', function () {
        Category::factory()->create(['slug' => 'existing-slug']);

        $this->actingAs($this->user)
            ->post('/admin/categories', [
                'name' => 'Test',
                'slug' => 'existing-slug',
                'is_active' => true,
            ])
            ->assertSessionHasErrors('slug');
    });
});

describe('Category Edit', function () {
    it('shows edit category form', function () {
        $category = Category::factory()->create();

        $this->actingAs($this->user)
            ->get("/admin/categories/{$category->slug}/edit")
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('admin/categories/edit')
                ->where('category.id', $category->id)
            );
    });

    it('can update a category', function () {
        $category = Category::factory()->create(['name' => 'Old Name']);

        $this->actingAs($this->user)
            ->put("/admin/categories/{$category->slug}", [
                'name' => 'New Name',
                'slug' => 'new-slug',
                'is_active' => true,
            ])
            ->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'slug' => 'new-slug',
        ]);
    });

    it('allows keeping same slug during update', function () {
        $category = Category::factory()->create(['slug' => 'my-slug']);

        $this->actingAs($this->user)
            ->put("/admin/categories/{$category->slug}", [
                'name' => 'Updated Name',
                'slug' => 'my-slug',
                'is_active' => true,
            ])
            ->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'slug' => 'my-slug',
        ]);
    });
});



describe('Category Delete', function () {
    it('can delete a category', function () {
        $category = Category::factory()->create();

        $this->actingAs($this->user)
            ->delete("/admin/categories/{$category->slug}")
            ->assertRedirect('/admin/categories');

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    });

    it('cascade deletes children when parent is deleted', function () {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $this->actingAs($this->user)
            ->delete("/admin/categories/{$parent->slug}");

        $this->assertDatabaseMissing('categories', ['id' => $parent->id]);
        $this->assertDatabaseMissing('categories', ['id' => $child->id]);
    });
});
