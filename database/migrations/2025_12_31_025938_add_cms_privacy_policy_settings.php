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
            ['key' => 'privacy_policy_hero_title', 'value' => 'Kebijakan Privasi', 'type' => 'string', 'group' => 'privacy_policy'],
            ['key' => 'privacy_policy_hero_description', 'value' => 'Pelajari bagaimana kami melindungi dan menggunakan informasi pribadi Anda.', 'type' => 'string', 'group' => 'privacy_policy'],
            ['key' => 'privacy_policy_last_updated', 'value' => now()->format('Y-m-d'), 'type' => 'string', 'group' => 'privacy_policy'],

            // Sections
            ['key' => 'privacy_policy_sections', 'value' => json_encode([
                [
                    'id' => 'info-collected',
                    'icon' => 'database',
                    'title' => '1. Informasi yang Kami Kumpulkan',
                    'content' => '<p class="mb-4">Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:</p><ul class="space-y-2"><li><strong>Informasi akun:</strong> Nama lengkap, alamat email, nomor telepon</li><li><strong>Informasi pengiriman:</strong> Alamat lengkap, kode pos, instruksi pengiriman</li><li><strong>Informasi pembayaran:</strong> Data transaksi (kami tidak menyimpan informasi kartu kredit)</li><li><strong>Riwayat pesanan:</strong> Produk yang dibeli, tanggal pembelian</li></ul>',
                ],
                [
                    'id' => 'info-usage',
                    'icon' => 'eye',
                    'title' => '2. Penggunaan Informasi',
                    'content' => '<p class="mb-4">Kami menggunakan informasi yang dikumpulkan untuk:</p><ul class="space-y-2"><li>Memproses dan mengirimkan pesanan Anda</li><li>Mengirimkan konfirmasi dan pembaruan status pesanan</li><li>Menanggapi pertanyaan dan permintaan dukungan</li><li>Meningkatkan kualitas layanan dan pengalaman pengguna</li><li>Mengirimkan informasi promosi (dengan persetujuan Anda)</li></ul>',
                ],
                [
                    'id' => 'data-security',
                    'icon' => 'lock',
                    'title' => '3. Keamanan Data',
                    'content' => '<p class="mb-4">Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses yang tidak sah, penggunaan, atau pengungkapan.</p><p class="mb-4">Langkah-langkah keamanan yang kami terapkan meliputi:</p><ul class="space-y-2"><li>Enkripsi SSL/TLS untuk semua transmisi data</li><li>Penyimpanan data yang aman dengan akses terbatas</li><li>Audit keamanan berkala</li><li>Pelatihan keamanan untuk staf</li></ul>',
                ],
                [
                    'id' => 'data-sharing',
                    'icon' => 'share2',
                    'title' => '4. Berbagi Informasi',
                    'content' => '<p class="mb-4">Kami <strong>tidak</strong> menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.</p><p class="mb-4">Kami hanya berbagi informasi dengan pihak-pihak berikut untuk tujuan operasional:</p><ul class="space-y-2"><li><strong>Jasa Pengiriman:</strong> Untuk mengirimkan pesanan Anda</li><li><strong>Payment Gateway:</strong> Untuk memproses pembayaran</li><li><strong>Otoritas Hukum:</strong> Jika diwajibkan oleh hukum</li></ul>',
                ],
                [
                    'id' => 'user-rights',
                    'icon' => 'user-check',
                    'title' => '5. Hak Pengguna',
                    'content' => '<p class="mb-4">Anda memiliki hak untuk:</p><ul class="space-y-2"><li>Mengakses dan memperbarui informasi pribadi Anda</li><li>Meminta penghapusan akun dan data Anda</li><li>Berhenti berlangganan dari email promosi</li><li>Meminta salinan data pribadi Anda</li></ul>',
                ],
                [
                    'id' => 'contact',
                    'icon' => 'mail',
                    'title' => '6. Hubungi Kami',
                    'content' => '<p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak-hak Anda terkait data pribadi, silakan hubungi kami melalui email atau halaman kontak kami. Tim kami akan merespons dalam waktu 1x24 jam kerja.</p>',
                ],
            ]), 'type' => 'json', 'group' => 'privacy_policy'],

            // Footer Note
            ['key' => 'privacy_policy_footer_note', 'value' => 'Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan privasi ini.', 'type' => 'string', 'group' => 'privacy_policy'],
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
        \App\Models\Setting::where('group', 'privacy_policy')->delete();
    }
};
