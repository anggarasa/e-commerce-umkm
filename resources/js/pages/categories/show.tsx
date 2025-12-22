import { index } from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DisplayIcon } from '@/components/ui/icon-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FolderTree } from 'lucide-react';

interface Props {
    category: Category;
}

export default function CategoriesShow({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kategori',
            href: index().url,
        },
        {
            title: category.name,
            href: `/categories/${category.slug}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={index().url}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            {category.icon ? (
                                <DisplayIcon
                                    iconName={category.icon}
                                    className="size-8 text-primary"
                                />
                            ) : (
                                <FolderTree className="size-8 text-muted-foreground" />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {category.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    /{category.slug}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/categories/${category.slug}/edit`}>
                            <Edit className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                            <CardDescription>
                                Detail kategori produk
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama
                                </p>
                                <p className="text-lg">{category.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Slug
                                </p>
                                <p className="font-mono text-sm">
                                    {category.slug}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Status
                                </p>
                                <span
                                    className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                                        category.is_active
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}
                                >
                                    {category.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            {category.description && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Deskripsi
                                    </p>
                                    <p className="text-sm">
                                        {category.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hierarki</CardTitle>
                            <CardDescription>Struktur kategori</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {category.parent && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Kategori Induk
                                    </p>
                                    <Link
                                        href={`/categories/${category.parent.slug}`}
                                        className="text-primary hover:underline"
                                    >
                                        {category.parent.name}
                                    </Link>
                                </div>
                            )}
                            {category.children &&
                                category.children.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Sub-Kategori
                                        </p>
                                        <ul className="mt-2 space-y-1">
                                            {category.children.map((child) => (
                                                <li key={child.id}>
                                                    <Link
                                                        href={`/categories/${child.slug}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            {!category.parent &&
                                (!category.children ||
                                    category.children.length === 0) && (
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada hierarki
                                    </p>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
