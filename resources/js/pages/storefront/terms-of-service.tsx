import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';
import {
    AlertCircle,
    ChevronRight,
    CreditCard,
    FileText,
    Package,
    RefreshCcw,
    Scale,
    ScrollText,
    Shield,
    ShoppingCart,
    Truck,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    categories: CategoryWithCount[];
}

export default function TermsOfService({ categories }: Props) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const lastUpdated = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const sections = [
        {
            id: 'acceptance',
            icon: FileText,
            title: '1. Penerimaan Syarat',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Dengan mengakses dan menggunakan website ini, Anda
                        menyetujui untuk terikat dengan syarat dan ketentuan
                        ini. Jika Anda tidak menyetujui syarat-syarat ini, mohon
                        untuk tidak menggunakan layanan kami.
                    </p>
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Kami berhak untuk mengubah syarat dan ketentuan
                                ini kapan saja. Perubahan akan berlaku segera
                                setelah dipublikasikan di website.
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'service-usage',
            icon: UserCog,
            title: '2. Penggunaan Layanan',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Anda setuju untuk menggunakan layanan kami hanya untuk
                        tujuan yang sah dan sesuai dengan hukum yang berlaku.
                    </p>
                    <p>Anda dilarang untuk:</p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Menggunakan layanan untuk tujuan ilegal atau tidak
                            sah
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Mengganggu atau merusak layanan atau server kami
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Melakukan penipuan atau memberikan informasi palsu
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Melanggar hak kekayaan intelektual
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'user-account',
            icon: Shield,
            title: '3. Akun Pengguna',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Anda bertanggung jawab untuk menjaga kerahasiaan akun
                        dan kata sandi Anda. Anda setuju untuk:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Memberikan informasi yang akurat dan lengkap
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Menjaga keamanan akun Anda
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Memberitahu kami segera jika ada penggunaan yang
                            tidak sah
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Bertanggung jawab atas semua aktivitas di akun Anda
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'products-pricing',
            icon: ShoppingCart,
            title: '4. Produk dan Harga',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Kami berusaha untuk menampilkan informasi produk dan
                        harga yang akurat. Namun:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Harga dapat berubah sewaktu-waktu tanpa
                            pemberitahuan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Kami berhak memperbaiki kesalahan harga
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Gambar produk hanya ilustrasi
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Ketersediaan produk tidak dijamin
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'payment',
            icon: CreditCard,
            title: '5. Pembayaran',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Pembayaran harus dilakukan sesuai dengan metode
                        pembayaran yang tersedia. Ketentuan pembayaran:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Pesanan diproses setelah pembayaran dikonfirmasi
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Pembayaran yang tidak berhasil akan dibatalkan
                            otomatis
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Semua harga sudah termasuk pajak yang berlaku
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Biaya pengiriman ditampilkan saat checkout
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'shipping',
            icon: Truck,
            title: '6. Pengiriman',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Waktu pengiriman bervariasi tergantung lokasi tujuan.
                        Ketentuan pengiriman:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Estimasi pengiriman bukan jaminan waktu kedatangan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Kami tidak bertanggung jawab atas keterlambatan
                            pihak ekspedisi
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Pastikan alamat pengiriman sudah benar
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Risiko kehilangan/kerusakan ditanggung ekspedisi
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'returns',
            icon: RefreshCcw,
            title: '7. Pengembalian',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Pengembalian produk dapat dilakukan dengan ketentuan
                        berikut:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Pengajuan dalam waktu{' '}
                            <strong className="text-foreground">7 hari</strong>{' '}
                            setelah diterima
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Produk cacat atau tidak sesuai pesanan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Produk dalam kondisi original dengan tag utuh
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Sertakan bukti pembelian dan foto produk
                        </li>
                    </ul>
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                        <p className="text-sm">
                            <strong className="text-foreground">
                                Catatan:
                            </strong>{' '}
                            Produk tertentu seperti pakaian dalam, produk
                            digital, dan custom order tidak dapat dikembalikan.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'changes',
            icon: Scale,
            title: '8. Perubahan Syarat',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Kami berhak untuk mengubah syarat dan ketentuan ini
                        kapan saja:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Perubahan berlaku segera setelah dipublikasikan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Notifikasi perubahan akan dikirim via email
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Penggunaan lanjutan berarti persetujuan terhadap
                            perubahan
                        </li>
                    </ul>
                </div>
            ),
        },
    ];

    const toggleSection = (id: string) => {
        setActiveSection(activeSection === id ? null : id);
    };

    return (
        <StorefrontLayout title="Syarat & Ketentuan" categories={categories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ScrollText className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            Syarat &{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Ketentuan
                            </span>
                        </h1>
                        <p className="mb-4 text-lg text-muted-foreground">
                            Ketahui aturan penggunaan layanan kami untuk
                            pengalaman berbelanja yang lebih baik.
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                            Terakhir diperbarui: {lastUpdated}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        {/* Quick Navigation */}
                        <div className="mb-12 rounded-2xl border border-border/50 bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                Daftar Isi
                            </h2>
                            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            document
                                                .getElementById(section.id)
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                })
                                        }
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <section.icon className="h-4 w-4 shrink-0 text-primary" />
                                        <span className="truncate">
                                            {section.title}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Sections */}
                        <div className="space-y-6">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30"
                                >
                                    <button
                                        onClick={() =>
                                            toggleSection(section.id)
                                        }
                                        className="flex w-full items-center justify-between p-6 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <section.icon className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-foreground">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <ChevronRight
                                            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                                                activeSection === section.id
                                                    ? 'rotate-90'
                                                    : ''
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${
                                            activeSection === section.id
                                                ? 'max-h-[1000px]'
                                                : 'max-h-0'
                                        }`}
                                    >
                                        <div className="border-t border-border/50 px-6 pt-4 pb-6">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                            <Package className="mx-auto mb-4 h-8 w-8 text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Dengan melakukan pemesanan di platform kami,
                                Anda menyatakan telah membaca, memahami, dan
                                menyetujui syarat dan ketentuan ini.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
