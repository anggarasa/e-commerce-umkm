<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'store_name', 'value' => 'GarraCommerce', 'group' => 'general'],
            ['key' => 'store_description', 'value' => 'Your trusted online store.', 'group' => 'general'],
            ['key' => 'store_address', 'value' => 'Jl. Contoh No. 123, Jakarta', 'group' => 'general'],
            ['key' => 'store_email', 'value' => 'admin@garracommerce.com', 'group' => 'general'],
            ['key' => 'store_phone', 'value' => '+6281234567890', 'group' => 'general'],

            // Social Media
            ['key' => 'social_facebook', 'value' => '', 'group' => 'social'],
            ['key' => 'social_instagram', 'value' => '', 'group' => 'social'],
            ['key' => 'social_twitter', 'value' => '', 'group' => 'social'],
            ['key' => 'social_tiktok', 'value' => '', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
