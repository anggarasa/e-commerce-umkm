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
import { Pagination } from '@/components/ui/pagination';
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
import { Edit, Eye, Package, Plus, Trash2 } from 'lucide-react';

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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/admin/products',
    },
];

export default function ProductsIndex({ products }: Props) {
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
                            src={`/storage/${product.media.find((m) => m.is_primary)?.path || product.media[0].path}`}
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
