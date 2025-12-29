<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContentPage>
 */
class ContentPageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(3),
            'content' => '<h2>'.fake()->sentence().'</h2><p>'.fake()->paragraphs(3, true).'</p>',
            'meta_description' => fake()->sentence(10),
            'is_active' => true,
        ];
    }
}
