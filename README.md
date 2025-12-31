# E-Commerce UMKM

Platform E-Commerce yang dirancang khusus untuk UMKM (Usaha Mikro, Kecil, dan Menengah), dibangun dengan teknologi modern untuk performa tinggi dan pengalaman pengguna yang luar biasa.

## 🚀 Teknologi

Project ini dibangun menggunakan stack teknologi berikut:

- **Framework PHP:** [Laravel 12](https://laravel.com)
- **Frontend:** [Inertia.js](https://inertiajs.com) (React)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Database:** MySQL / PostgreSQL
- **Development Tool:** Vite

## 📋 Fitur Utama

- **Storefront Modern:** Tampilan toko yang responsif dan menarik.
- **CMS Admin:** Manajemen konten untuk halaman statis (Tentang Kami, Kebijakan Privasi, dll).
- **Manajemen Produk & Kategori:** Pengelolaan katalog produk yang mudah.
- **Manajemen Pesanan:** Pelacakan dan pengelolaan pesanan pelanggan.
- **Laporan & Analitik:** Insight performa penjualan.

## 🛠️ Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan project di komputer lokal Anda:

### Prasyarat

Pastikan Anda telah menginstal:

- PHP >= 8.2
- Composer
- Node.js & NPM
- Database Server (MySQL/MariaDB)

### Langkah Instalasi

1. **Clone Repository**

    ```bash
    git clone https://github.com/anggarasa/e-commerce-umkm.git
    cd e-commerce-umkm
    ```

2. **Install Dependencies**

    ```bash
    composer install
    npm install
    ```

3. **Konfigurasi Environment**
   Salin file `.env.example` ke `.env` dan sesuaikan konfigurasi database Anda.

    ```bash
    cp .env.example .env
    ```

    Buka file `.env` dan atur `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`.

4. **Generate Application Key**

    ```bash
    php artisan key:generate
    ```

5. **Jalankan Migrasi & Seeder**

    ```bash
    php artisan migrate --seed
    ```

6. **Jalankan Development Server**
   Buka dua terminal terpisah untuk menjalankan server Laravel dan Vite:

    Terminal 1:

    ```bash
    php artisan serve
    ```

    Terminal 2:

    ```bash
    npm run dev
    ```

7. **Akses Aplikasi**
   Buka browser dan kunjungi `http://localhost:8000`.

## 📚 Dokumentasi

Dokumentasi lengkap mengenai penggunaan dan pengembangan sistem ini dapat ditemukan di dalam kode sumber atau melalui menu dokumentasi di aplikasi admin.

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat Pull Request atau buka Issue untuk diskusi perubahan.
