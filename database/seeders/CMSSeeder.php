<?php

namespace Database\Seeders;

use App\Models\ContentPage;
use Illuminate\Database\Seeder;

class CMSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Tentang Kami',
                'slug' => 'about-us',
                'content' => '<h2>Selamat Datang di Toko Kami</h2>
<p>Kami adalah platform e-commerce yang berkomitmen untuk menyediakan produk berkualitas dengan harga terjangkau kepada pelanggan kami.</p>

<h3>Visi Kami</h3>
<p>Menjadi platform e-commerce terpercaya yang menghubungkan UMKM dengan konsumen di seluruh Indonesia.</p>

<h3>Misi Kami</h3>
<ul>
<li>Menyediakan produk berkualitas dengan harga kompetitif</li>
<li>Memberikan layanan pelanggan terbaik</li>
<li>Mendukung pertumbuhan UMKM lokal</li>
<li>Menjamin keamanan transaksi online</li>
</ul>

<h3>Mengapa Memilih Kami?</h3>
<p>Kami percaya bahwa berbelanja online harus menjadi pengalaman yang menyenangkan dan aman. Itulah mengapa kami berkomitmen untuk:</p>
<ul>
<li>Produk 100% original</li>
<li>Pengiriman cepat ke seluruh Indonesia</li>
<li>Customer service 24/7</li>
<li>Pembayaran yang aman</li>
</ul>',
                'meta_description' => 'Tentang kami - Platform e-commerce terpercaya yang menyediakan produk berkualitas untuk kebutuhan Anda.',
                'is_active' => true,
            ],
            [
                'title' => 'Kebijakan Privasi',
                'slug' => 'privacy-policy',
                'content' => '<h2>Kebijakan Privasi</h2>
<p>Terakhir diperbarui: '.date('d F Y').'</p>

<h3>1. Informasi yang Kami Kumpulkan</h3>
<p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:</p>
<ul>
<li>Nama lengkap</li>
<li>Alamat email</li>
<li>Nomor telepon</li>
<li>Alamat pengiriman</li>
<li>Informasi pembayaran</li>
</ul>

<h3>2. Penggunaan Informasi</h3>
<p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
<ul>
<li>Memproses dan mengirimkan pesanan Anda</li>
<li>Mengirimkan konfirmasi dan pembaruan pesanan</li>
<li>Menanggapi pertanyaan dan permintaan Anda</li>
<li>Meningkatkan layanan kami</li>
</ul>

<h3>3. Keamanan Data</h3>
<p>Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses yang tidak sah, penggunaan, atau pengungkapan.</p>

<h3>4. Berbagi Informasi</h3>
<p>Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya berbagi informasi dengan penyedia layanan yang membantu kami dalam operasi bisnis.</p>

<h3>5. Hubungi Kami</h3>
<p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui halaman kontak kami.</p>',
                'meta_description' => 'Kebijakan Privasi - Pelajari bagaimana kami melindungi dan menggunakan informasi pribadi Anda.',
                'is_active' => true,
            ],
            [
                'title' => 'Syarat & Ketentuan',
                'slug' => 'terms-of-service',
                'content' => '<h2>Syarat & Ketentuan</h2>
<p>Terakhir diperbarui: '.date('d F Y').'</p>

<h3>1. Penerimaan Syarat</h3>
<p>Dengan mengakses dan menggunakan website ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.</p>

<h3>2. Penggunaan Layanan</h3>
<p>Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku.</p>

<h3>3. Akun Pengguna</h3>
<p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk memberitahu kami segera jika ada penggunaan yang tidak sah.</p>

<h3>4. Produk dan Harga</h3>
<p>Kami berusaha untuk menampilkan informasi produk dan harga yang akurat. Namun, kami berhak untuk memperbaiki kesalahan harga kapan saja.</p>

<h3>5. Pembayaran</h3>
<p>Pembayaran harus dilakukan sesuai dengan metode pembayaran yang tersedia. Pesanan akan diproses setelah pembayaran dikonfirmasi.</p>

<h3>6. Pengiriman</h3>
<p>Waktu pengiriman bervariasi tergantung lokasi. Kami tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak ekspedisi.</p>

<h3>7. Pengembalian</h3>
<p>Pengembalian produk dapat dilakukan dalam waktu 7 hari setelah diterima jika produk cacat atau tidak sesuai pesanan.</p>

<h3>8. Perubahan Syarat</h3>
<p>Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di website.</p>',
                'meta_description' => 'Syarat & Ketentuan - Ketahui aturan penggunaan layanan kami.',
                'is_active' => true,
            ],
        ];

        foreach ($pages as $page) {
            ContentPage::updateOrCreate(
                ['slug' => $page['slug']],
                $page
            );
        }
    }
}
