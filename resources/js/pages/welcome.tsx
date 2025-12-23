import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Headphones,
    Shield,
    ShoppingBag,
    Star,
    Truck,
} from 'lucide-react';

import { CategoryCard } from '@/components/storefront/category-card';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/storefront-layout';
import { index as productsIndex } from '@/routes/products';
import { type CategoryWithCount, type Product } from '@/types';

interface WelcomeProps {
    featuredProducts: Product[];
    featuredCategories: CategoryWithCount[];
}

export default function Welcome({
    featuredProducts = [],
    featuredCategories = [],
}: WelcomeProps) {
    return (
        <StorefrontLayout title="Beranda" categories={featuredCategories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative container mx-auto px-4 py-20 lg:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <Star className="h-4 w-4 fill-primary" />
                            Platform E-commerce Terbaik untuk UMKM
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                            Temukan Produk{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Berkualitas
                            </span>{' '}
                            untuk Kebutuhan Anda
                        </h1>
                        <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
                            Belanja lebih mudah dengan koleksi produk
                            terlengkap. Kualitas terjamin, harga terjangkau, dan
                            pengiriman cepat ke seluruh Indonesia.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={productsIndex()}>
                                <Button
                                    size="lg"
                                    className="w-full gap-2 sm:w-auto"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Mulai Belanja
                                </Button>
                            </Link>
                            <Link href={productsIndex()}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full gap-2 sm:w-auto"
                                >
                                    Lihat Katalog
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
            <section className="border-b border-border/40 bg-muted/30 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Pengiriman Cepat
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Ke seluruh Indonesia
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Produk Original
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    100% keaslian terjamin
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Headphones className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Layanan 24/7</h4>
                                <p className="text-sm text-muted-foreground">
                                    Customer service siap membantu
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Harga Terbaik</h4>
                                <p className="text-sm text-muted-foreground">
                                    Kompetitif dan terjangkau
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            {featuredCategories.length > 0 && (
                <section className="py-16 lg:py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-10 text-center">
                            <h2 className="mb-3 text-3xl font-bold tracking-tight">
                                Kategori Produk
                            </h2>
                            <p className="text-muted-foreground">
                                Temukan produk berdasarkan kategori favoritmu
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
                                Siap untuk Berbelanja?
                            </h2>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
                                Temukan ribuan produk berkualitas dengan harga
                                terbaik. Hubungi kami via WhatsApp untuk
                                pemesanan cepat dan mudah.
                            </p>
                            <Link href={productsIndex()}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Jelajahi Produk
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
    );
}
