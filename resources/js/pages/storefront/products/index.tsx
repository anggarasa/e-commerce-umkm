import { router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Grid3X3,
    LayoutGrid,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { ProductCard } from '@/components/storefront/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cn } from '@/lib/utils';
import { index as productsIndex } from '@/routes/products';
import {
    type CategoryWithCount,
    type Product,
    type ProductFilters,
} from '@/types';

interface ProductsPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    categories: CategoryWithCount[];
    filters: ProductFilters;
}

const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'price_asc', label: 'Harga: Rendah ke Tinggi' },
    { value: 'price_desc', label: 'Harga: Tinggi ke Rendah' },
    { value: 'name_asc', label: 'Nama: A-Z' },
    { value: 'name_desc', label: 'Nama: Z-A' },
];

const FilterSidebar = ({
    categories,
    filters,
    localFilters,
    setLocalFilters,
    applyFilters,
    clearFilters,
    hasActiveFilters,
}: {
    categories: CategoryWithCount[];
    filters: ProductFilters;
    localFilters: ProductFilters;
    setLocalFilters: (filters: ProductFilters) => void;
    applyFilters: (newFilters: Partial<ProductFilters>) => void;
    clearFilters: () => void;
    hasActiveFilters?: string | number | boolean;
}) => (
    <div className="space-y-6">
        {/* Categories */}
        <div>
            <Label className="mb-3 block text-sm font-semibold">Kategori</Label>
            <div className="space-y-2">
                <button
                    onClick={() => applyFilters({ category: undefined })}
                    className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        !filters.category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted',
                    )}
                >
                    Semua Kategori
                </button>
                {categories.map((category) => (
                    <div key={category.id}>
                        <button
                            onClick={() =>
                                applyFilters({ category: category.slug })
                            }
                            className={cn(
                                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                                filters.category === category.slug
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted',
                            )}
                        >
                            <span>{category.name}</span>
                            <span
                                className={cn(
                                    'text-xs',
                                    filters.category === category.slug
                                        ? 'text-primary-foreground/70'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {category.products_count}
                            </span>
                        </button>
                        {/* Child Categories */}
                        {category.children && category.children.length > 0 && (
                            <div className="mt-1 ml-3 space-y-1 border-l pl-2">
                                {category.children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() =>
                                            applyFilters({
                                                category: child.slug,
                                            })
                                        }
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                                            filters.category === child.slug
                                                ? 'bg-primary/10 font-medium text-primary'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                        )}
                                    >
                                        <span>{child.name}</span>
                                        <span className="text-xs opacity-70">
                                            {(child as CategoryWithCount)
                                                .products_count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Price Range */}
        <div>
            <Label className="mb-3 block text-sm font-semibold">
                Rentang Harga
            </Label>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label className="mb-1 text-xs text-muted-foreground">
                        Min
                    </Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={localFilters.min_price || ''}
                        onChange={(e) =>
                            setLocalFilters({
                                ...localFilters,
                                min_price: Number(e.target.value) || undefined,
                            })
                        }
                        onBlur={() =>
                            applyFilters({
                                min_price: localFilters.min_price,
                            })
                        }
                    />
                </div>
                <div>
                    <Label className="mb-1 text-xs text-muted-foreground">
                        Max
                    </Label>
                    <Input
                        type="number"
                        placeholder="1000000"
                        value={localFilters.max_price || ''}
                        onChange={(e) =>
                            setLocalFilters({
                                ...localFilters,
                                max_price: Number(e.target.value) || undefined,
                            })
                        }
                        onBlur={() =>
                            applyFilters({
                                max_price: localFilters.max_price,
                            })
                        }
                    />
                </div>
            </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
            <Button variant="outline" className="w-full" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Hapus Filter
            </Button>
        )}
    </div>
);

export default function ProductsIndex({
    products,
    categories,
    filters,
}: ProductsPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [gridCols, setGridCols] = useState<3 | 4>(4);
    const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

    const applyFilters = (newFilters: Partial<ProductFilters>) => {
        const updatedFilters = { ...localFilters, ...newFilters };
        setLocalFilters(updatedFilters);

        // Remove empty values
        const params: Record<string, string> = {};
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params[key] = String(value);
            }
        });

        router.get(productsIndex(), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const goToPage = (page: number) => {
        const params: Record<string, string> = { page: String(page) };
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params[key] = String(value);
            }
        });

        router.get(productsIndex(), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocalFilters({});
        router.get(
            productsIndex(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const hasActiveFilters =
        filters.search ||
        filters.category ||
        filters.min_price ||
        filters.max_price;

    return (
        <StorefrontLayout title="Semua Produk" categories={categories}>
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight">
                        Semua Produk
                    </h1>
                    <p className="text-muted-foreground">
                        Temukan berbagai produk berkualitas untuk kebutuhan Anda
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden w-64 shrink-0 lg:block">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FilterSidebar
                                    categories={categories}
                                    filters={filters}
                                    localFilters={localFilters}
                                    setLocalFilters={setLocalFilters}
                                    applyFilters={applyFilters}
                                    clearFilters={clearFilters}
                                    hasActiveFilters={hasActiveFilters}
                                />
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Search */}
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-2 sm:max-w-sm"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Cari
                                </Button>
                            </form>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {/* Mobile Filter */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="lg:hidden"
                                        >
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filter
                                            {hasActiveFilters && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    Aktif
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>
                                                Filter Produk
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterSidebar
                                                categories={categories}
                                                filters={filters}
                                                localFilters={localFilters}
                                                setLocalFilters={
                                                    setLocalFilters
                                                }
                                                applyFilters={applyFilters}
                                                clearFilters={clearFilters}
                                                hasActiveFilters={
                                                    hasActiveFilters
                                                }
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sort */}
                                <Select
                                    value={filters.sort || 'newest'}
                                    onValueChange={(value) =>
                                        applyFilters({
                                            sort: value as ProductFilters['sort'],
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Grid Toggle */}
                                <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
                                    <Button
                                        variant={
                                            gridCols === 3
                                                ? 'secondary'
                                                : 'ghost'
                                        }
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setGridCols(3)}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            gridCols === 4
                                                ? 'secondary'
                                                : 'ghost'
                                        }
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setGridCols(4)}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Filter aktif:
                                </span>
                                {filters.search && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Pencarian: {filters.search}
                                        <button
                                            onClick={() =>
                                                applyFilters({
                                                    search: undefined,
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filters.category && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Kategori:{' '}
                                        {
                                            categories.find(
                                                (c) =>
                                                    c.slug === filters.category,
                                            )?.name
                                        }
                                        <button
                                            onClick={() =>
                                                applyFilters({
                                                    category: undefined,
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(filters.min_price || filters.max_price) && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Harga: Rp {filters.min_price || 0} - Rp{' '}
                                        {filters.max_price || '∞'}
                                        <button
                                            onClick={() =>
                                                applyFilters({
                                                    min_price: undefined,
                                                    max_price: undefined,
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Products Grid */}
                        {products.data.length > 0 ? (
                            <>
                                <div
                                    className={cn(
                                        'grid gap-6',
                                        gridCols === 3
                                            ? 'sm:grid-cols-2 lg:grid-cols-3'
                                            : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                                    )}
                                >
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
                                            Menampilkan {products.from} -{' '}
                                            {products.to} dari {products.total}{' '}
                                            produk
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    goToPage(
                                                        products.current_page -
                                                            1,
                                                    )
                                                }
                                                disabled={
                                                    products.current_page <= 1
                                                }
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Sebelumnya
                                            </Button>
                                            <span className="px-4 text-sm">
                                                Halaman {products.current_page}{' '}
                                                dari {products.last_page}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    goToPage(
                                                        products.current_page +
                                                            1,
                                                    )
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
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Produk tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Coba ubah filter pencarian atau lihat semua
                                    produk
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Hapus Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
