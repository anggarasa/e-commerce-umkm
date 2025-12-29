import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';
import {
    ChevronRight,
    Database,
    Eye,
    Lock,
    Mail,
    Share2,
    Shield,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    categories: CategoryWithCount[];
}

export default function PrivacyPolicy({ categories }: Props) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const lastUpdated = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const sections = [
        {
            id: 'info-collected',
            icon: Database,
            title: '1. Informasi yang Kami Kumpulkan',
            content: (
                <>
                    <p className="mb-4 text-muted-foreground">
                        Kami mengumpulkan informasi yang Anda berikan secara
                        langsung kepada kami, termasuk:
                    </p>
                    <ul className="mb-4 space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Informasi akun:
                                </strong>{' '}
                                Nama lengkap, alamat email, nomor telepon
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Informasi pengiriman:
                                </strong>{' '}
                                Alamat lengkap, kode pos, instruksi pengiriman
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Informasi pembayaran:
                                </strong>{' '}
                                Data transaksi (kami tidak menyimpan informasi
                                kartu kredit)
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Riwayat pesanan:
                                </strong>{' '}
                                Produk yang dibeli, tanggal pembelian
                            </span>
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'info-usage',
            icon: Eye,
            title: '2. Penggunaan Informasi',
            content: (
                <>
                    <p className="mb-4 text-muted-foreground">
                        Kami menggunakan informasi yang dikumpulkan untuk:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Memproses dan mengirimkan pesanan Anda
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Mengirimkan konfirmasi dan pembaruan status pesanan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Menanggapi pertanyaan dan permintaan dukungan
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Meningkatkan kualitas layanan dan pengalaman
                            pengguna
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Mengirimkan informasi promosi (dengan persetujuan
                            Anda)
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'data-security',
            icon: Lock,
            title: '3. Keamanan Data',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Kami mengambil langkah-langkah keamanan yang wajar untuk
                        melindungi informasi pribadi Anda dari akses yang tidak
                        sah, penggunaan, atau pengungkapan.
                    </p>
                    <p>Langkah-langkah keamanan yang kami terapkan meliputi:</p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Enkripsi SSL/TLS untuk semua transmisi data
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Penyimpanan data yang aman dengan akses terbatas
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Audit keamanan berkala
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Pelatihan keamanan untuk staf
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'data-sharing',
            icon: Share2,
            title: '4. Berbagi Informasi',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        Kami <strong className="text-foreground">tidak</strong>{' '}
                        menjual atau menyewakan informasi pribadi Anda kepada
                        pihak ketiga.
                    </p>
                    <p>
                        Kami hanya berbagi informasi dengan pihak-pihak berikut
                        untuk tujuan operasional:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Jasa Pengiriman:
                                </strong>{' '}
                                Untuk mengirimkan pesanan Anda
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Payment Gateway:
                                </strong>{' '}
                                Untuk memproses pembayaran
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                                <strong className="text-foreground">
                                    Otoritas Hukum:
                                </strong>{' '}
                                Jika diwajibkan oleh hukum
                            </span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'user-rights',
            icon: UserCheck,
            title: '5. Hak Pengguna',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <p>Anda memiliki hak untuk:</p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Mengakses dan memperbarui informasi pribadi Anda
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Meminta penghapusan akun dan data Anda
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Berhenti berlangganan dari email promosi
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Meminta salinan data pribadi Anda
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'contact',
            icon: Mail,
            title: '6. Hubungi Kami',
            content: (
                <p className="text-muted-foreground">
                    Jika Anda memiliki pertanyaan tentang kebijakan privasi ini
                    atau ingin menggunakan hak-hak Anda terkait data pribadi,
                    silakan hubungi kami melalui email atau halaman kontak kami.
                    Tim kami akan merespons dalam waktu 1x24 jam kerja.
                </p>
            ),
        },
    ];

    const toggleSection = (id: string) => {
        setActiveSection(activeSection === id ? null : id);
    };

    return (
        <StorefrontLayout title="Kebijakan Privasi" categories={categories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Shield className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            Kebijakan{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Privasi
                            </span>
                        </h1>
                        <p className="mb-4 text-lg text-muted-foreground">
                            Pelajari bagaimana kami melindungi dan menggunakan
                            informasi pribadi Anda.
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
                            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                            <Shield className="mx-auto mb-4 h-8 w-8 text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Dengan menggunakan layanan kami, Anda menyetujui
                                pengumpulan dan penggunaan informasi sesuai
                                dengan kebijakan privasi ini.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
