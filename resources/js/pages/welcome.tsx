import { Link } from '@inertiajs/react';
import {
    ArrowRight,
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
    Phone,
    RefreshCcw,
    Shield,
    ShoppingBag,
    Star,
    Tag,
    ThumbsUp,
    Truck,
    Wallet,
    Zap,
} from 'lucide-react';
import { ReactNode } from 'react';

import { CategoryCard } from '@/components/storefront/category-card';
import { ProductCard } from '@/components/storefront/product-card';
import { WelcomeModal } from '@/components/storefront/welcome-modal';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/storefront-layout';
import { index as productsIndex } from '@/routes/products';
import { type CategoryWithCount, type Product } from '@/types';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface HomepageSettings {
    hero_badge?: string;
    hero_title?: string;
    hero_description?: string;
    hero_cta_primary?: string;
    hero_cta_secondary?: string;
    features?: Feature[];
    cta_title?: string;
    cta_description?: string;
    cta_button_text?: string;
}

interface WelcomeProps {
    featuredProducts: Product[];
    featuredCategories: CategoryWithCount[];
    homepageSettings?: HomepageSettings;
}

const getIconComponent = (iconName: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        truck: <Truck className="h-6 w-6" />,
        shield: <Shield className="h-6 w-6" />,
        headphones: <Headphones className="h-6 w-6" />,
        star: <Star className="h-6 w-6" />,
        'credit-card': <CreditCard className="h-6 w-6" />,
        'refresh-ccw': <RefreshCcw className="h-6 w-6" />,
        box: <Box className="h-6 w-6" />,
        'map-pin': <MapPin className="h-6 w-6" />,
        clock: <Clock className="h-6 w-6" />,
        gift: <Gift className="h-6 w-6" />,
        lock: <Lock className="h-6 w-6" />,
        phone: <Phone className="h-6 w-6" />,
        mail: <Mail className="h-6 w-6" />,
        award: <Award className="h-6 w-6" />,
        'thumbs-up': <ThumbsUp className="h-6 w-6" />,
        wallet: <Wallet className="h-6 w-6" />,
        zap: <Zap className="h-6 w-6" />,
        globe: <Globe className="h-6 w-6" />,
        heart: <Heart className="h-6 w-6" />,
        tag: <Tag className="h-6 w-6" />,
    };
    return iconMap[iconName] || <HelpCircle className="h-6 w-6" />;
};

export default function Welcome({
    featuredProducts = [],
    featuredCategories = [],
    homepageSettings = {},
}: WelcomeProps) {
    // Default values
    const heroBadge =
        homepageSettings.hero_badge || 'Platform E-commerce Terbaik untuk UMKM';
    const heroTitle =
        homepageSettings.hero_title ||
        'Temukan Produk Berkualitas untuk Kebutuhan Anda';
    const heroDescription =
        homepageSettings.hero_description ||
        'Belanja lebih mudah dengan koleksi produk terlengkap. Kualitas terjamin, harga terjangkau, dan pengiriman cepat ke seluruh Indonesia.';
    const heroCtaPrimary = homepageSettings.hero_cta_primary || 'Mulai Belanja';
    const heroCtaSecondary =
        homepageSettings.hero_cta_secondary || 'Lihat Katalog';
    const ctaTitle = homepageSettings.cta_title || 'Siap untuk Berbelanja?';
    const ctaDescription =
        homepageSettings.cta_description ||
        'Temukan ribuan produk berkualitas dengan harga terbaik. Hubungi kami via WhatsApp untuk pemesanan cepat dan mudah.';
    const ctaButtonText = homepageSettings.cta_button_text || 'Jelajahi Produk';
    const features = homepageSettings.features || [
        {
            icon: 'truck',
            title: 'Pengiriman Cepat',
            description: 'Ke seluruh Indonesia',
        },
        {
            icon: 'shield',
            title: 'Produk Original',
            description: '100% keaslian terjamin',
        },
        {
            icon: 'headphones',
            title: 'Layanan 24/7',
            description: 'Customer service siap membantu',
        },
        {
            icon: 'star',
            title: 'Harga Terbaik',
            description: 'Kompetitif dan terjangkau',
        },
    ];

    // Parse hero title to highlight "Berkualitas"
    const renderHeroTitle = () => {
        const parts = heroTitle.split('Berkualitas');
        if (parts.length === 2) {
            return (
                <>
                    {parts[0]}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Berkualitas
                    </span>
                    {parts[1]}
                </>
            );
        }
        return heroTitle;
    };

    return (
        <>
            <WelcomeModal />
            <StorefrontLayout title="Beranda" categories={featuredCategories}>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                    <div className="relative container mx-auto px-4 py-20 lg:py-32">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                <Star className="h-4 w-4 fill-primary" />
                                {heroBadge}
                            </div>
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                                {renderHeroTitle()}
                            </h1>
                            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
                                {heroDescription}
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href={productsIndex()}>
                                    <Button
                                        size="lg"
                                        className="w-full gap-2 sm:w-auto"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {heroCtaPrimary}
                                    </Button>
                                </Link>
                                <Link href={productsIndex()}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full gap-2 sm:w-auto"
                                    >
                                        {heroCtaSecondary}
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                </section>

                {/* Features Section */}
                {features.length > 0 && (
                    <section className="border-b border-border/40 bg-muted/30 py-8">
                        <div className="container mx-auto px-4">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {getIconComponent(feature.icon)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Categories */}
                {featuredCategories.length > 0 && (
                    <section className="py-16 lg:py-20">
                        <div className="container mx-auto px-4">
                            <div className="mb-10 text-center">
                                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                                    Kategori Produk
                                </h2>
                                <p className="text-muted-foreground">
                                    Temukan produk berdasarkan kategori
                                    favoritmu
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6">
                                {featuredCategories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.33%-1.5rem)] lg:w-[calc(16.666%-1.5rem)]"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="bg-muted/30 py-16 lg:py-20">
                        <div className="container mx-auto px-4">
                            <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div>
                                    <h2 className="mb-2 text-3xl font-bold tracking-tight">
                                        Produk Terbaru
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Koleksi produk terbaru kami untuk Anda
                                    </p>
                                </div>
                                <Link href={productsIndex()}>
                                    <Button variant="outline" className="gap-2">
                                        Lihat Semua
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 lg:py-20">
                    <div className="container mx-auto px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 text-center text-primary-foreground lg:px-16">
                            <div className="relative z-10">
                                <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                    {ctaTitle}
                                </h2>
                                <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
                                    {ctaDescription}
                                </p>
                                <Link href={productsIndex()}>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {ctaButtonText}
                                    </Button>
                                </Link>
                            </div>

                            {/* Decorative circles */}
                            <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10" />
                            <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10" />
                        </div>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
