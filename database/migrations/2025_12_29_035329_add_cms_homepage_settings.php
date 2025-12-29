<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settings = [
            // Hero Section
            ['key' => 'hero_badge', 'value' => 'Platform E-commerce Terbaik untuk UMKM', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'hero_title', 'value' => 'Temukan Produk Berkualitas untuk Kebutuhan Anda', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'hero_description', 'value' => 'Belanja lebih mudah dengan koleksi produk terlengkap. Kualitas terjamin, harga terjangkau, dan pengiriman cepat ke seluruh Indonesia.', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'hero_cta_primary', 'value' => 'Mulai Belanja', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'hero_cta_secondary', 'value' => 'Lihat Katalog', 'type' => 'string', 'group' => 'homepage'],

            // Features Section
            ['key' => 'features', 'value' => json_encode([
                ['icon' => 'truck', 'title' => 'Pengiriman Cepat', 'description' => 'Ke seluruh Indonesia'],
                ['icon' => 'shield', 'title' => 'Produk Original', 'description' => '100% keaslian terjamin'],
                ['icon' => 'headphones', 'title' => 'Layanan 24/7', 'description' => 'Customer service siap membantu'],
                ['icon' => 'star', 'title' => 'Harga Terbaik', 'description' => 'Kompetitif dan terjangkau'],
            ]), 'type' => 'json', 'group' => 'homepage'],

            // CTA Section
            ['key' => 'cta_title', 'value' => 'Siap untuk Berbelanja?', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'cta_description', 'value' => 'Temukan ribuan produk berkualitas dengan harga terbaik. Hubungi kami via WhatsApp untuk pemesanan cepat dan mudah.', 'type' => 'string', 'group' => 'homepage'],
            ['key' => 'cta_button_text', 'value' => 'Jelajahi Produk', 'type' => 'string', 'group' => 'homepage'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::create($setting);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Setting::where('group', 'homepage')->delete();
    }
};
