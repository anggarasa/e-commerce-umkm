import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';
import {
    Award,
    Box,
    Clock,
    CreditCard,
    Gift,
    Globe,
    Headphones,
    Heart,
    HelpCircle,
    Lock,
    Mail,
    MapPin,
    Package,
    Phone,
    RefreshCcw,
    Shield,
    ShoppingBag,
    Star,
    Tag,
    Target,
    ThumbsUp,
    Truck,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import { ReactNode } from 'react';

interface Setting {
    key: string;
    value: string | null;
    type: string;
    group: string;
}

interface StatItem {
    value: string;
    label: string;
}

interface ValueItem {
    icon: string;
    title: string;
    description: string;
}

interface Props {
    categories: CategoryWithCount[];
    aboutUsSettings: Record<string, Setting>;
}

const getIconComponent = (
    iconName: string,
    className: string = 'h-6 w-6',
): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        truck: <Truck className={className} />,
        shield: <Shield className={className} />,
        headphones: <Headphones className={className} />,
        star: <Star className={className} />,
        'credit-card': <CreditCard className={className} />,
        'refresh-ccw': <RefreshCcw className={className} />,
        box: <Box className={className} />,
        'map-pin': <MapPin className={className} />,
        clock: <Clock className={className} />,
        gift: <Gift className={className} />,
        lock: <Lock className={className} />,
        phone: <Phone className={className} />,
        mail: <Mail className={className} />,
        award: <Award className={className} />,
        'thumbs-up': <ThumbsUp className={className} />,
        wallet: <Wallet className={className} />,
        zap: <Zap className={className} />,
        globe: <Globe className={className} />,
        heart: <Heart className={className} />,
        tag: <Tag className={className} />,
        users: <Users className={className} />,
        target: <Target className={className} />,
        package: <Package className={className} />,
    };
    return iconMap[iconName] || <HelpCircle className={className} />;
};

export default function AboutUs({ categories, aboutUsSettings }: Props) {
    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string = ''): string => {
        return aboutUsSettings[key]?.value || defaultValue;
    };

    // Helper to parse JSON setting
    const parseJsonSetting = <T,>(key: string, defaultValue: T): T => {
        try {
            const value = aboutUsSettings[key]?.value;
            if (!value) return defaultValue;
            return JSON.parse(value);
        } catch {
            return defaultValue;
        }
    };

    // Get CMS data with defaults
    const heroBadge = getSetting(
        'about_us_hero_badge',
        'E-Commerce Terpercaya',
    );
    const heroTitle = getSetting('about_us_hero_title', 'Tentang Kami');
    const heroDescription = getSetting(
        'about_us_hero_description',
        'Kami adalah platform e-commerce yang berkomitmen untuk menyediakan produk berkualitas dengan harga terjangkau, mendukung pertumbuhan UMKM lokal di seluruh Indonesia.',
    );

    const stats = parseJsonSetting<StatItem[]>('about_us_stats', [
        { value: '10K+', label: 'Produk Tersedia' },
        { value: '50K+', label: 'Pelanggan Puas' },
        { value: '100+', label: 'UMKM Partner' },
        { value: '34', label: 'Provinsi Terjangkau' },
    ]);

    const visionTitle = getSetting('about_us_vision_title', 'Visi Kami');
    const visionDescription = getSetting(
        'about_us_vision_description',
        'Menjadi platform e-commerce terpercaya yang menghubungkan UMKM dengan konsumen di seluruh Indonesia, menciptakan ekosistem perdagangan digital yang inklusif dan berkelanjutan.',
    );

    const missionTitle = getSetting('about_us_mission_title', 'Misi Kami');
    const missionItems = parseJsonSetting<string[]>('about_us_mission_items', [
        'Menyediakan produk berkualitas dengan harga kompetitif',
        'Memberikan layanan pelanggan terbaik',
        'Mendukung pertumbuhan UMKM lokal',
        'Menjamin keamanan transaksi online',
    ]);

    const valuesTitle = getSetting(
        'about_us_values_title',
        'Mengapa Memilih Kami?',
    );
    const valuesDescription = getSetting(
        'about_us_values_description',
        'Kami percaya bahwa berbelanja online harus menjadi pengalaman yang menyenangkan dan aman.',
    );
    const values = parseJsonSetting<ValueItem[]>('about_us_values', [
        {
            icon: 'heart',
            title: 'Kualitas Terjamin',
            description:
                'Setiap produk melalui proses kurasi ketat untuk memastikan kualitas terbaik bagi pelanggan.',
        },
        {
            icon: 'shield',
            title: 'Transaksi Aman',
            description:
                'Sistem keamanan berlapis melindungi setiap transaksi dan data pribadi Anda.',
        },
        {
            icon: 'truck',
            title: 'Pengiriman Cepat',
            description:
                'Jaringan logistik yang luas memastikan produk sampai tepat waktu ke seluruh Indonesia.',
        },
        {
            icon: 'headphones',
            title: 'Layanan Pelanggan',
            description:
                'Tim customer service profesional siap membantu 24/7 untuk pengalaman belanja terbaik.',
        },
    ]);

    const featuresTitle = getSetting(
        'about_us_features_title',
        'Keunggulan Platform',
    );
    const featuresDescription = getSetting(
        'about_us_features_description',
        'Fitur-fitur yang membuat belanja online menjadi lebih mudah dan menyenangkan.',
    );
    const features = parseJsonSetting<ValueItem[]>('about_us_features', [
        {
            icon: 'box',
            title: 'Beragam Produk',
            description: 'Koleksi lengkap dari berbagai kategori',
        },
        {
            icon: 'zap',
            title: 'Proses Mudah',
            description: 'Belanja online yang simpel dan cepat',
        },
        {
            icon: 'award',
            title: 'Produk Original',
            description: 'Jaminan keaslian 100% produk',
        },
        {
            icon: 'box',
            title: 'Pengemasan Aman',
            description: 'Kemasan yang melindungi produk Anda',
        },
    ]);

    const ctaTitle = getSetting('about_us_cta_title', 'Siap Untuk Berbelanja?');
    const ctaDescription = getSetting(
        'about_us_cta_description',
        'Temukan produk berkualitas dengan harga terjangkau untuk kebutuhan Anda.',
    );
    const ctaButtonText = getSetting(
        'about_us_cta_button_text',
        'Lihat Produk',
    );

    return (
        <StorefrontLayout title="Tentang Kami" categories={categories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <Star className="h-4 w-4" />
                            {heroBadge}
                        </span>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            {heroTitle.split(' ').length > 1 ? (
                                <>
                                    {heroTitle
                                        .split(' ')
                                        .slice(0, -1)
                                        .join(' ')}{' '}
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        {heroTitle.split(' ').slice(-1)}
                                    </span>
                                </>
                            ) : (
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    {heroTitle}
                                </span>
                            )}
                        </h1>
                        <p className="text-lg leading-relaxed text-muted-foreground lg:text-xl">
                            {heroDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {stats.length > 0 && (
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
            )}

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
                                    {visionTitle}
                                </h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    {visionDescription}
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
                                    {missionTitle}
                                </h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    {missionItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            {values.length > 0 && (
                <section className="bg-muted/30 py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                                {valuesTitle}
                            </h2>
                            <p className="text-muted-foreground">
                                {valuesDescription}
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        {getIconComponent(value.icon)}
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
            )}

            {/* Features Grid */}
            {features.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                                {featuresTitle}
                            </h2>
                            <p className="text-muted-foreground">
                                {featuresDescription}
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                        {getIconComponent(
                                            feature.icon,
                                            'h-8 w-8',
                                        )}
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
            )}

            {/* CTA Section */}
            <section className="border-t border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
                            {ctaTitle}
                        </h2>
                        <p className="mb-8 text-muted-foreground">
                            {ctaDescription}
                        </p>
                        <a
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {ctaButtonText}
                        </a>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
