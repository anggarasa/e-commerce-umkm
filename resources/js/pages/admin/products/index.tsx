import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import {
    create,
    destroy,
    edit as editRoute,
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
        total: number;
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
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>
                            Total {products.total} produk ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">
                                        Gambar
                                    </TableHead>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="mb-2 size-8 opacity-50" />
                                                <p>Belum ada produk</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                    {product.media &&
                                                    product.media.length > 0 ? (
                                                        <img
                                                            src={`/storage/${product.media.find((m) => m.is_primary)?.path || product.media[0].path}`}
                                                            alt={product.name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="size-5 text-muted-foreground/50" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={showRoute.url(
                                                        product.id,
                                                    )}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                                                    {product.slug}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {product.category?.name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(
                                                    Number(product.price),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.stock}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                >
                                                    {product.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={showRoute.url(
                                                                product.id,
                                                            )}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={editRoute.url(
                                                                product.id,
                                                            )}
                                                        >
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
                                                        onConfirm={() =>
                                                            handleDelete(
                                                                product.id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
