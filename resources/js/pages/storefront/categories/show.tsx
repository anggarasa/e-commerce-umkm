import { Link, router } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { ArrowLeft, ChevronLeft, ChevronRight, Package } from 'lucide-react';

import { ProductCard } from '@/components/storefront/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StorefrontLayout from '@/layouts/storefront-layout';
import { show as showCategory } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import { type Category, type Product } from '@/types';

interface CategoryShowProps {
    category: Category & {
        children?: Category[];
    };
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export default function CategoryShow({
    category,
    products,
}: CategoryShowProps) {
    // Get icon component dynamically
    const IconComponent = category.icon
        ? (LucideIcons[
              category.icon as keyof typeof LucideIcons
          ] as LucideIcons.LucideIcon)
        : Package;

    const goToPage = (page: number) => {
        router.get(
            showCategory(category.slug),
            { page },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <StorefrontLayout title={category.name}>
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
                    <span className="text-foreground">{category.name}</span>
                </nav>

                {/* Back button */}
                <Link
                    href={productsIndex()}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke katalog
                </Link>

                {/* Category Header */}
                <div className="mb-10 flex flex-col items-start gap-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 lg:flex-row lg:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <IconComponent className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-muted-foreground">
                                {category.description}
                            </p>
                        )}
                        <div className="mt-3">
                            <Badge variant="secondary">
                                {products.total} produk
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Sub Categories */}
                {category.children && category.children.length > 0 && (
                    <section className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold">
                            Sub Kategori
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {category.children.map((child) => {
                                const ChildIcon = child.icon
                                    ? (LucideIcons[
                                          child.icon as keyof typeof LucideIcons
                                      ] as LucideIcons.LucideIcon)
                                    : Package;

                                return (
                                    <Link
                                        key={child.id}
                                        href={showCategory(child.slug)}
                                    >
                                        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                                            <CardContent className="flex items-center gap-3 p-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <ChildIcon className="h-5 w-5" />
                                                </div>
                                                <span className="font-medium">
                                                    {child.name}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Products Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {/* Simple Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {products.from} - {products.to}{' '}
                                    dari {products.total} produk
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            goToPage(products.current_page - 1)
                                        }
                                        disabled={products.current_page <= 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <span className="px-4 text-sm">
                                        Halaman {products.current_page} dari{' '}
                                        {products.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            goToPage(products.current_page + 1)
                                        }
                                        disabled={
                                            products.current_page >=
                                            products.last_page
                                        }
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Belum ada produk
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                            Kategori ini belum memiliki produk. Silakan lihat
                            kategori lainnya.
                        </p>
                        <Link href={productsIndex()}>
                            <Button variant="outline">
                                Lihat Semua Produk
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
