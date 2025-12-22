import {
    destroy,
    index,
} from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DisplayIcon } from '@/components/ui/icon-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Edit, FolderTree, Plus, Trash2 } from 'lucide-react';

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: index().url,
    },
];

function CategoryItem({
    category,
    level = 0,
}: {
    category: Category;
    level?: number;
}) {
    const hasChildren = category.children && category.children.length > 0;

    const handleDelete = () => {
        router.delete(destroy(category.slug).url);
    };

    return (
        <div className="border-b last:border-b-0">
            <div
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
                style={{ paddingLeft: `${level * 24 + 16}px` }}
            >
                <div className="flex items-center gap-3">
                    {hasChildren && (
                        <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                    {!hasChildren && level > 0 && <span className="size-4" />}
                    {category.icon ? (
                        <DisplayIcon
                            iconName={category.icon}
                            className="size-5 text-primary"
                        />
                    ) : (
                        <FolderTree className="size-5 text-muted-foreground" />
                    )}
                    <div>
                        <span className="font-medium">{category.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                            /{category.slug}
                        </span>
                    </div>
                    {!category.is_active && (
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Nonaktif
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/categories/${category.slug}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Hapus Kategori</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus kategori "
                                    {category.name}"?
                                    {hasChildren && (
                                        <span className="mt-2 block font-medium text-destructive">
                                            Peringatan: Semua sub-kategori juga
                                            akan dihapus!
                                        </span>
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Hapus
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            {hasChildren &&
                category.children!.map((child) => (
                    <CategoryItem
                        key={child.id}
                        category={child}
                        level={level + 1}
                    />
                ))}
        </div>
    );
}

export default function CategoriesIndex({ categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Kategori Produk
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola kategori produk Anda
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/categories/create">
                            <Plus className="mr-2 size-4" />
                            Tambah Kategori
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kategori</CardTitle>
                        <CardDescription>
                            Kategori produk dengan hierarki parent-child
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FolderTree className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Belum ada kategori
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/categories/create">
                                        <Plus className="mr-2 size-4" />
                                        Tambah Kategori
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {categories.map((category) => (
                                    <CategoryItem
                                        key={category.id}
                                        category={category}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
