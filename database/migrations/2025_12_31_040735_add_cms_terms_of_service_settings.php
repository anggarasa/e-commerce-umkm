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
            ['key' => 'terms_of_service_hero_title', 'value' => 'Syarat & Ketentuan', 'type' => 'string', 'group' => 'terms_of_service'],
            ['key' => 'terms_of_service_hero_description', 'value' => 'Ketahui aturan penggunaan layanan kami untuk pengalaman berbelanja yang lebih baik.', 'type' => 'string', 'group' => 'terms_of_service'],
            ['key' => 'terms_of_service_last_updated', 'value' => now()->format('Y-m-d'), 'type' => 'string', 'group' => 'terms_of_service'],

            // Sections
            ['key' => 'terms_of_service_sections', 'value' => json_encode([
                [
                    'id' => 'acceptance',
                    'icon' => 'file-text',
                    'title' => '1. Penerimaan Syarat',
                    'content' => '<p class="mb-4">Dengan mengakses dan menggunakan website ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui syarat-syarat ini, mohon untuk tidak menggunakan layanan kami.</p><div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"><p class="text-sm text-amber-700 dark:text-amber-300">⚠️ Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di website.</p></div>',
                ],
                [
                    'id' => 'service-usage',
                    'icon' => 'user-check',
                    'title' => '2. Penggunaan Layanan',
                    'content' => '<p class="mb-4">Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku.</p><p class="mb-2">Anda dilarang untuk:</p><ul class="list-disc list-inside space-y-1"><li>Menggunakan layanan untuk tujuan ilegal atau tidak sah</li><li>Mengganggu atau merusak layanan atau server kami</li><li>Melakukan penipuan atau memberikan informasi palsu</li><li>Melanggar hak kekayaan intelektual</li></ul>',
                ],
                [
                    'id' => 'user-account',
                    'icon' => 'shield',
                    'title' => '3. Akun Pengguna',
                    'content' => '<p class="mb-4">Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk:</p><ul class="list-disc list-inside space-y-1"><li>Memberikan informasi yang akurat dan lengkap</li><li>Menjaga keamanan akun Anda</li><li>Memberitahu kami segera jika ada penggunaan yang tidak sah</li><li>Bertanggung jawab atas semua aktivitas di akun Anda</li></ul>',
                ],
                [
                    'id' => 'products-pricing',
                    'icon' => 'database',
                    'title' => '4. Produk dan Harga',
                    'content' => '<p class="mb-4">Kami berusaha untuk menampilkan informasi produk dan harga yang akurat. Namun:</p><ul class="list-disc list-inside space-y-1"><li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan</li><li>Kami berhak memperbaiki kesalahan harga</li><li>Gambar produk hanya ilustrasi</li><li>Ketersediaan produk tidak dijamin</li></ul>',
                ],
                [
                    'id' => 'payment',
                    'icon' => 'lock',
                    'title' => '5. Pembayaran',
                    'content' => '<p class="mb-4">Pembayaran harus dilakukan sesuai dengan metode pembayaran yang tersedia. Ketentuan pembayaran:</p><ul class="list-disc list-inside space-y-1"><li>Pesanan diproses setelah pembayaran dikonfirmasi</li><li>Pembayaran yang tidak berhasil akan dibatalkan otomatis</li><li>Semua harga sudah termasuk pajak yang berlaku</li><li>Biaya pengiriman ditampilkan saat checkout</li></ul>',
                ],
                [
                    'id' => 'shipping',
                    'icon' => 'share2',
                    'title' => '6. Pengiriman',
                    'content' => '<p class="mb-4">Waktu pengiriman bervariasi tergantung lokasi tujuan. Ketentuan pengiriman:</p><ul class="list-disc list-inside space-y-1"><li>Estimasi pengiriman bukan jaminan waktu kedatangan</li><li>Kami tidak bertanggung jawab atas keterlambatan pihak ekspedisi</li><li>Pastikan alamat pengiriman sudah benar</li><li>Risiko kehilangan/kerusakan ditanggung ekspedisi</li></ul>',
                ],
                [
                    'id' => 'returns',
                    'icon' => 'eye',
                    'title' => '7. Pengembalian',
                    'content' => '<p class="mb-4">Pengembalian produk dapat dilakukan dengan ketentuan berikut:</p><ul class="list-disc list-inside space-y-1"><li>Pengajuan dalam waktu <strong>7 hari</strong> setelah diterima</li><li>Produk cacat atau tidak sesuai pesanan</li><li>Produk dalam kondisi original dengan tag utuh</li><li>Sertakan bukti pembelian dan foto produk</li></ul><div class="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4"><p class="text-sm"><strong>Catatan:</strong> Produk tertentu seperti pakaian dalam, produk digital, dan custom order tidak dapat dikembalikan.</p></div>',
                ],
                [
                    'id' => 'changes',
                    'icon' => 'mail',
                    'title' => '8. Perubahan Syarat',
                    'content' => '<p class="mb-4">Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja:</p><ul class="list-disc list-inside space-y-1"><li>Perubahan berlaku segera setelah dipublikasikan</li><li>Notifikasi perubahan akan dikirim via email</li><li>Penggunaan lanjutan berarti persetujuan terhadap perubahan</li></ul>',
                ],
            ]), 'type' => 'json', 'group' => 'terms_of_service'],

            // Footer Note
            ['key' => 'terms_of_service_footer_note', 'value' => 'Dengan melakukan pemesanan di platform kami, Anda menyatakan telah membaca, memahami, dan menyetujui syarat dan ketentuan ini.', 'type' => 'string', 'group' => 'terms_of_service'],
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
        \App\Models\Setting::where('group', 'terms_of_service')->delete();
    }
};
