import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';
import {
    Award,
    Heart,
    Package,
    Shield,
    ShoppingBag,
    Star,
    Target,
    Truck,
    Users,
    Zap,
} from 'lucide-react';

interface Props {
    categories: CategoryWithCount[];
}

export default function AboutUs({ categories }: Props) {
    const values = [
        {
            icon: Heart,
            title: 'Kualitas Terjamin',
            description:
                'Setiap produk melalui proses kurasi ketat untuk memastikan kualitas terbaik bagi pelanggan.',
        },
        {
            icon: Shield,
            title: 'Transaksi Aman',
            description:
                'Sistem keamanan berlapis melindungi setiap transaksi dan data pribadi Anda.',
        },
        {
            icon: Truck,
            title: 'Pengiriman Cepat',
            description:
                'Jaringan logistik yang luas memastikan produk sampai tepat waktu ke seluruh Indonesia.',
        },
        {
            icon: Users,
            title: 'Layanan Pelanggan',
            description:
                'Tim customer service profesional siap membantu 24/7 untuk pengalaman belanja terbaik.',
        },
    ];

    const stats = [
        { value: '10K+', label: 'Produk Tersedia' },
        { value: '50K+', label: 'Pelanggan Puas' },
        { value: '100+', label: 'UMKM Partner' },
        { value: '34', label: 'Provinsi Terjangkau' },
    ];

    const features = [
        {
            icon: ShoppingBag,
            title: 'Beragam Produk',
            description: 'Koleksi lengkap dari berbagai kategori',
        },
        {
            icon: Zap,
            title: 'Proses Mudah',
            description: 'Belanja online yang simpel dan cepat',
        },
        {
            icon: Award,
            title: 'Produk Original',
            description: 'Jaminan keaslian 100% produk',
        },
        {
            icon: Package,
            title: 'Pengemasan Aman',
            description: 'Kemasan yang melindungi produk Anda',
        },
    ];

    return (
        <StorefrontLayout title="Tentang Kami" categories={categories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <Star className="h-4 w-4" />
                            E-Commerce Terpercaya
                        </span>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            Tentang{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Kami
                            </span>
                        </h1>
                        <p className="text-lg leading-relaxed text-muted-foreground lg:text-xl">
                            Kami adalah platform e-commerce yang berkomitmen
                            untuk menyediakan produk berkualitas dengan harga
                            terjangkau, mendukung pertumbuhan UMKM lokal di
                            seluruh Indonesia.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-b border-border/40 bg-muted/30 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-primary lg:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Vision */}
                        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
                            <div className="relative">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Target className="h-7 w-7" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-foreground">
                                    Visi Kami
                                </h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    Menjadi platform e-commerce terpercaya yang
                                    menghubungkan UMKM dengan konsumen di
                                    seluruh Indonesia, menciptakan ekosistem
                                    perdagangan digital yang inklusif dan
                                    berkelanjutan.
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
                            <div className="relative">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-foreground">
                                    Misi Kami
                                </h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        Menyediakan produk berkualitas dengan
                                        harga kompetitif
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        Memberikan layanan pelanggan terbaik
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        Mendukung pertumbuhan UMKM lokal
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        Menjamin keamanan transaksi online
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-muted/30 py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                            Mengapa Memilih Kami?
                        </h2>
                        <p className="text-muted-foreground">
                            Kami percaya bahwa berbelanja online harus menjadi
                            pengalaman yang menyenangkan dan aman.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <value.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-semibold text-foreground">
                                    {value.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                            Keunggulan Platform
                        </h2>
                        <p className="text-muted-foreground">
                            Fitur-fitur yang membuat belanja online menjadi
                            lebih mudah dan menyenangkan.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="mb-2 font-semibold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
                            Siap Untuk Berbelanja?
                        </h2>
                        <p className="mb-8 text-muted-foreground">
                            Temukan produk berkualitas dengan harga terjangkau
                            untuk kebutuhan Anda.
                        </p>
                        <a
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Lihat Produk
                        </a>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
