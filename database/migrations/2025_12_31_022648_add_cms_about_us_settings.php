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
            ['key' => 'about_us_hero_badge', 'value' => 'E-Commerce Terpercaya', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_hero_title', 'value' => 'Tentang Kami', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_hero_description', 'value' => 'Kami adalah platform e-commerce yang berkomitmen untuk menyediakan produk berkualitas dengan harga terjangkau, mendukung pertumbuhan UMKM lokal di seluruh Indonesia.', 'type' => 'string', 'group' => 'about_us'],

            // Stats Section
            ['key' => 'about_us_stats', 'value' => json_encode([
                ['value' => '10K+', 'label' => 'Produk Tersedia'],
                ['value' => '50K+', 'label' => 'Pelanggan Puas'],
                ['value' => '100+', 'label' => 'UMKM Partner'],
                ['value' => '34', 'label' => 'Provinsi Terjangkau'],
            ]), 'type' => 'json', 'group' => 'about_us'],

            // Vision Section
            ['key' => 'about_us_vision_title', 'value' => 'Visi Kami', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_vision_description', 'value' => 'Menjadi platform e-commerce terpercaya yang menghubungkan UMKM dengan konsumen di seluruh Indonesia, menciptakan ekosistem perdagangan digital yang inklusif dan berkelanjutan.', 'type' => 'string', 'group' => 'about_us'],

            // Mission Section
            ['key' => 'about_us_mission_title', 'value' => 'Misi Kami', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_mission_items', 'value' => json_encode([
                'Menyediakan produk berkualitas dengan harga kompetitif',
                'Memberikan layanan pelanggan terbaik',
                'Mendukung pertumbuhan UMKM lokal',
                'Menjamin keamanan transaksi online',
            ]), 'type' => 'json', 'group' => 'about_us'],

            // Values Section
            ['key' => 'about_us_values_title', 'value' => 'Mengapa Memilih Kami?', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_values_description', 'value' => 'Kami percaya bahwa berbelanja online harus menjadi pengalaman yang menyenangkan dan aman.', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_values', 'value' => json_encode([
                ['icon' => 'heart', 'title' => 'Kualitas Terjamin', 'description' => 'Setiap produk melalui proses kurasi ketat untuk memastikan kualitas terbaik bagi pelanggan.'],
                ['icon' => 'shield', 'title' => 'Transaksi Aman', 'description' => 'Sistem keamanan berlapis melindungi setiap transaksi dan data pribadi Anda.'],
                ['icon' => 'truck', 'title' => 'Pengiriman Cepat', 'description' => 'Jaringan logistik yang luas memastikan produk sampai tepat waktu ke seluruh Indonesia.'],
                ['icon' => 'headphones', 'title' => 'Layanan Pelanggan', 'description' => 'Tim customer service profesional siap membantu 24/7 untuk pengalaman belanja terbaik.'],
            ]), 'type' => 'json', 'group' => 'about_us'],

            // Features Section
            ['key' => 'about_us_features_title', 'value' => 'Keunggulan Platform', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_features_description', 'value' => 'Fitur-fitur yang membuat belanja online menjadi lebih mudah dan menyenangkan.', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_features', 'value' => json_encode([
                ['icon' => 'box', 'title' => 'Beragam Produk', 'description' => 'Koleksi lengkap dari berbagai kategori'],
                ['icon' => 'zap', 'title' => 'Proses Mudah', 'description' => 'Belanja online yang simpel dan cepat'],
                ['icon' => 'award', 'title' => 'Produk Original', 'description' => 'Jaminan keaslian 100% produk'],
                ['icon' => 'box', 'title' => 'Pengemasan Aman', 'description' => 'Kemasan yang melindungi produk Anda'],
            ]), 'type' => 'json', 'group' => 'about_us'],

            // CTA Section
            ['key' => 'about_us_cta_title', 'value' => 'Siap Untuk Berbelanja?', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_cta_description', 'value' => 'Temukan produk berkualitas dengan harga terjangkau untuk kebutuhan Anda.', 'type' => 'string', 'group' => 'about_us'],
            ['key' => 'about_us_cta_button_text', 'value' => 'Lihat Produk', 'type' => 'string', 'group' => 'about_us'],
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
        \App\Models\Setting::where('group', 'about_us')->delete();
    }
};
