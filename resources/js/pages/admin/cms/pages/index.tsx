import { editPage } from '@/actions/App/Http/Controllers/Admin/CMSController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Pencil } from 'lucide-react';

interface ContentPage {
    id: number;
    title: string;
    slug: string;
    is_active: boolean;
    updated_at: string;
}

interface Props {
    pages: ContentPage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'CMS',
        href: '/admin/cms/homepage',
    },
    {
        title: 'Halaman Statis',
        href: '/admin/cms/pages',
    },
];

export default function PagesIndex({ pages }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Halaman Statis" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Halaman Statis
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola halaman statis seperti Tentang Kami, Kebijakan
                        Privasi, dll.
                    </p>
                </div>

                <Card>
                    <CardHeader icon={<FileText className="size-5" />}>
                        <CardTitle>Daftar Halaman</CardTitle>
                        <CardDescription>
                            Semua halaman statis yang tersedia
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Terakhir Diperbarui</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">
                                            {page.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            /page/{page.slug}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    page.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {page.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                page.updated_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={editPage.url({
                                                    contentPage: page.id,
                                                })}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Pencil className="mr-2 size-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {pages.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada halaman statis.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
