import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    MessageCircle,
    Minus,
    Package,
    Plus,
    ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';

import { add as addToCart } from '@/actions/App/Http/Controllers/CartController';
import { ProductCard } from '@/components/storefront/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cn, formatCurrency } from '@/lib/utils';
import { show as showCategory } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import { type Category, type Product, type ProductMedia } from '@/types';

interface ProductShowProps {
    product: Product & {
        category: Category;
        media: ProductMedia[];
    };
    relatedProducts: Product[];
}

export default function ProductShow({
    product,
    relatedProducts,
}: ProductShowProps) {
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

    const primaryMedia =
        product.media.find((m) => m.is_primary) || product.media[0];
    const allMedia = product.media.length > 0 ? product.media : [];
    const currentMedia = allMedia[selectedMediaIndex] || primaryMedia;
    const isOutOfStock = product.stock <= 0;
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        router.post(
            addToCart(),
            { product_id: product.id, quantity },
            { preserveScroll: true },
        );
    };

    const handleWhatsApp = () => {
        const message = `Halo, saya tertarik dengan produk:\n\n*${product.name}*\nHarga: ${formatCurrency(product.price)}\nJumlah: ${quantity}\n\nMohon informasi lebih lanjut.`;
        const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const nextMedia = () => {
        if (allMedia.length > 1) {
            setSelectedMediaIndex((prev) => (prev + 1) % allMedia.length);
        }
    };

    const prevMedia = () => {
        if (allMedia.length > 1) {
            setSelectedMediaIndex(
                (prev) => (prev - 1 + allMedia.length) % allMedia.length,
            );
        }
    };

    return (
        <StorefrontLayout title={product.name}>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={productsIndex()}
                        className="hover:text-foreground"
                    >
                        Produk
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    {product.category && (
                        <>
                            <Link
                                href={showCategory(product.category.slug)}
                                className="hover:text-foreground"
                            >
                                {product.category.name}
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                    <span className="text-foreground">{product.name}</span>
                </nav>

                {/* Back button */}
                <Link
                    href={productsIndex()}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke katalog
                </Link>

                {/* Product Details */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Media Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                            {currentMedia ? (
                                currentMedia.type === 'video' ? (
                                    <video
                                        src={currentMedia.url}
                                        className="h-full w-full bg-black object-contain"
                                        controls
                                        poster={
                                            currentMedia.thumbnail_url ||
                                            undefined
                                        }
                                    />
                                ) : (
                                    <img
                                        src={currentMedia.url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                )
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <ImageOff className="h-24 w-24 text-muted-foreground/30" />
                                </div>
                            )}

                            {/* Navigation arrows */}
                            {allMedia.length > 1 && (
                                <>
                                    <button
                                        onClick={prevMedia}
                                        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextMedia}
                                        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {/* Out of stock overlay */}
                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                    <Badge
                                        variant="destructive"
                                        className="text-lg"
                                    >
                                        Stok Habis
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allMedia.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {allMedia.map((media, index) => (
                                    <button
                                        key={media.id}
                                        onClick={() =>
                                            setSelectedMediaIndex(index)
                                        }
                                        className={cn(
                                            'relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                                            selectedMediaIndex === index
                                                ? 'border-primary'
                                                : 'border-transparent hover:border-muted-foreground/50',
                                        )}
                                    >
                                        <img
                                            src={
                                                media.thumbnail_url || media.url
                                            }
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                        {media.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="h-6 w-6 rounded-full bg-white/90" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category */}
                        {product.category && (
                            <Link href={showCategory(product.category.slug)}>
                                <Badge variant="secondary" className="mb-2">
                                    {product.category.name}
                                </Badge>
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="text-4xl font-bold text-primary">
                            {formatCurrency(product.price)}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            {isOutOfStock ? (
                                <span className="text-destructive">
                                    Stok Habis
                                </span>
                            ) : product.stock <= 5 ? (
                                <span className="text-orange-500">
                                    Tersisa {product.stock} item
                                </span>
                            ) : (
                                <span className="text-green-600">
                                    Stok Tersedia ({product.stock})
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-3 font-semibold">
                                        Deskripsi Produk
                                    </h3>
                                    <div className="prose prose-sm max-w-none text-muted-foreground">
                                        {product.description
                                            .split('\n')
                                            .map((paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* CTA */}
                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">
                                        Jumlah:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() =>
                                                setQuantity((q) =>
                                                    Math.max(1, q - 1),
                                                )
                                            }
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => {
                                                const val =
                                                    parseInt(e.target.value) ||
                                                    1;
                                                setQuantity(
                                                    Math.min(
                                                        Math.max(1, val),
                                                        product.stock,
                                                    ),
                                                );
                                            }}
                                            className="h-9 w-20 text-center"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() =>
                                                setQuantity((q) =>
                                                    Math.min(
                                                        product.stock,
                                                        q + 1,
                                                    ),
                                                )
                                            }
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="flex-1 gap-2"
                                    disabled={isOutOfStock}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {isOutOfStock
                                        ? 'Stok Habis'
                                        : 'Tambah ke Keranjang'}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2"
                                    disabled={isOutOfStock}
                                    onClick={handleWhatsApp}
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp
                                </Button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                            <p>
                                🛒 Tambahkan produk ke keranjang atau langsung
                                hubungi kami via WhatsApp untuk pemesanan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold">
                            Produk Terkait
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={relatedProduct}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StorefrontLayout>
    );
}
