import {
    create,
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { DisplayIcon } from '@/components/ui/icon-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Edit, FolderTree, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    const handleDelete = () => {
        return new Promise<void>((resolve) => {
            router.delete(destroy(category.slug).url, {
                onFinish: () => resolve(),
            });
        });
    };

    const handleToggle = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="border-b border-border/50 last:border-b-0">
            <div
                className="group flex items-center justify-between px-4 py-3.5 transition-all duration-200 hover:bg-muted/30"
                style={{ paddingLeft: `${level * 24 + 16}px` }}
            >
                <div className="flex items-center gap-3">
                    {hasChildren && (
                        <button
                            onClick={handleToggle}
                            className="rounded-md p-1 transition-colors hover:bg-accent"
                            type="button"
                            aria-label={isExpanded ? 'Tutup' : 'Buka'}
                        >
                            <ChevronRight
                                className={`size-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            />
                        </button>
                    )}
                    {!hasChildren && level > 0 && <span className="size-6" />}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        {category.icon ? (
                            <DisplayIcon
                                iconName={category.icon}
                                className="size-5 text-primary"
                            />
                        ) : (
                            <FolderTree className="size-5 text-primary/70" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                            {category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            /{category.slug}
                        </span>
                    </div>
                    {!category.is_active && (
                        <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                            Nonaktif
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-9 rounded-lg"
                    >
                        <Link href={edit(category.slug).url}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                    <DeleteConfirmationDialog
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        }
                        title="Hapus Kategori"
                        description={
                            <>
                                Apakah Anda yakin ingin menghapus kategori "
                                <span className="font-semibold">
                                    {category.name}
                                </span>
                                "?
                                {hasChildren && (
                                    <span className="mt-3 block rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                                        ⚠️ Peringatan: Semua sub-kategori juga
                                        akan dihapus!
                                    </span>
                                )}
                            </>
                        }
                        onConfirm={handleDelete}
                    />
                </div>
            </div>
            {hasChildren &&
                isExpanded &&
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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Kategori Produk
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola kategori dan sub-kategori produk Anda
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Tambah Kategori
                        </Link>
                    </Button>
                </div>

                {/* Category List Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/30">
                        <CardTitle className="text-lg">
                            Daftar Kategori
                        </CardTitle>
                        <CardDescription>
                            Kategori produk dengan struktur hierarki
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <FolderTree className="size-8 text-primary" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    Belum ada kategori
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Mulai dengan menambahkan kategori pertama
                                    Anda
                                </p>
                                <Button asChild className="mt-6" size="lg">
                                    <Link href={create().url}>
                                        <Plus className="mr-2 size-4" />
                                        Tambah Kategori
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
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
