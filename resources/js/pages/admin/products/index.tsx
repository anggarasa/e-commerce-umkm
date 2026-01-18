import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ColumnDef, DataTable } from '@/components/ui/data-table';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import {
    create,
    destroy,
    edit as editRoute,
    index as indexRoute,
    show as showRoute,
} from '@/routes/admin/products';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Package, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    categories: { id: string; name: string }[];
    filters: {
        search?: string;
        category_id?: string;
        is_active?: string;
        limit?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/admin/products',
    },
];

export default function ProductsIndex({
    products,
    categories,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || 'all');
    const [status, setStatus] = useState(filters.is_active ?? 'all');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.visit(indexRoute.url(), {
                    data: {
                        ...filters,
                        search: search || null,
                        page: 1,
                    },
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                category_id: value === 'all' ? null : value,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                is_active: value === 'all' ? null : value,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryId('all');
        setStatus('all');
        router.visit(indexRoute.url(), {
            data: {
                limit: filters.limit,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id: string) => {
        return new Promise<void>((resolve) => {
            router.delete(destroy.url(id), {
                onFinish: () => resolve(),
            });
        });
    };

    const handlePageChange = (page: number) => {
        router.visit(indexRoute.url(), {
            data: {
                page,
                // Preserve existing query params like limit if needed
                limit: products.per_page,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePerPageChange = (limit: number) => {
        router.visit(indexRoute.url(), {
            data: {
                page: 1, // Reset to first page when changing limit
                limit,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Define columns for the DataTable
    const columns: ColumnDef<Product>[] = [
        {
            id: 'image',
            header: 'Gambar',
            headerClassName: 'w-[80px]',
            cell: (product) => (
                <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {product.media && product.media.length > 0 ? (
                        <img
                            src={
                                product.media.find((m) => m.is_primary)?.url ||
                                product.media[0].url
                            }
                            alt={product.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <Package className="size-5 text-muted-foreground/50" />
                    )}
                </div>
            ),
        },
        {
            id: 'name',
            header: 'Nama Produk',
            cell: (product) => (
                <div>
                    <Link
                        href={showRoute.url(product.id)}
                        className="font-medium hover:text-primary hover:underline"
                    >
                        {product.name}
                    </Link>
                    <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {product.slug}
                    </div>
                </div>
            ),
        },
        {
            id: 'category',
            header: 'Kategori',
            cell: (product) => product.category?.name || '-',
        },
        {
            id: 'price',
            header: 'Harga',
            cell: (product) => formatCurrency(Number(product.price)),
        },
        {
            id: 'stock',
            header: 'Stok',
            cell: (product) => product.stock,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (product) => (
                <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                    {product.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            cell: (product) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={showRoute.url(product.id)}>
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={editRoute.url(product.id)}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                    <DeleteConfirmationDialog
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        }
                        title="Hapus Produk"
                        description={`Apakah Anda yakin ingin menghapus produk "${product.name}"?`}
                        onConfirm={() => handleDelete(product.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Manajemen Produk
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola daftar produk, harga, dan stok
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href={create.url()}>
                            <Plus className="mr-2 size-4" />
                            Tambah Produk
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Produk</CardTitle>
                        <CardDescription>
                            Cari dan filter produk berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau deskripsi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={categoryId}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="0">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                            {(search ||
                                categoryId !== 'all' ||
                                status !== 'all') && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="px-2 lg:px-3"
                                >
                                    Reset
                                    <X className="ml-2 size-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader
                        action={
                            <Button asChild size="sm">
                                <Link href={create.url()}>
                                    <Plus className="mr-2 size-4" />
                                    Tambah Produk
                                </Link>
                            </Button>
                        }
                    >
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>
                            Total {products.total} produk ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DataTable
                            columns={columns}
                            data={products.data}
                            getRowKey={(product) => product.id}
                            emptyState={{
                                icon: (
                                    <Package className="mb-2 size-12 text-muted-foreground/40" />
                                ),
                                title: 'Belum ada produk',
                                description:
                                    'Mulai dengan menambahkan produk pertama Anda',
                                action: (
                                    <Button asChild size="sm">
                                        <Link href={create.url()}>
                                            <Plus className="mr-2 size-4" />
                                            Tambah Produk
                                        </Link>
                                    </Button>
                                ),
                            }}
                        />

                        <Pagination
                            meta={products}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
