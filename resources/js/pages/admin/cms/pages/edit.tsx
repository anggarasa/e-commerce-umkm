import { updatePage } from '@/actions/App/Http/Controllers/Admin/CMSController';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    FileText,
    Loader2,
    Save,
} from 'lucide-react';
import { FormEventHandler } from 'react';

interface ContentPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_description: string | null;
    is_active: boolean;
}

interface Props {
    page: ContentPage;
}

export default function EditPage({ page }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'CMS',
            href: '/admin/cms/homepage',
        },
        {
            title: 'Halaman Statis',
            href: '/admin/cms/pages',
        },
        {
            title: page.title,
            href: `/admin/cms/pages/${page.id}/edit`,
        },
    ];

    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            title: page.title,
            content: page.content,
            meta_description: page.meta_description || '',
            is_active: page.is_active,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(updatePage.url({ contentPage: page.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${page.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/cms/pages">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="size-4" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit {page.title}
                            </h1>
                        </div>
                        <p className="ml-12 text-sm text-muted-foreground">
                            Kelola konten halaman {page.title.toLowerCase()}
                        </p>
                    </div>
                    <a
                        href={`/page/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 size-4" />
                            Lihat Halaman
                        </Button>
                    </a>
                </div>

                {/* Success Message */}
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                >
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
                        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-700 dark:text-green-300">
                            Halaman berhasil disimpan!
                        </AlertDescription>
                    </Alert>
                </Transition>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader icon={<FileText className="size-5" />}>
                            <CardTitle>Informasi Halaman</CardTitle>
                            <CardDescription>
                                Detail dan konten halaman
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="title">
                                            Judul Halaman
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            className="mt-2"
                                        />
                                        {errors.title && (
                                            <p className="mt-1.5 text-xs text-destructive">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="slug">Slug URL</Label>
                                        <Input
                                            id="slug"
                                            value={page.slug}
                                            disabled
                                            className="mt-2 bg-muted"
                                        />
                                        <p className="mt-1.5 text-xs text-muted-foreground">
                                            URL: /page/{page.slug}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="meta_description">
                                        Meta Description (SEO)
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                'meta_description',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                        rows={2}
                                        placeholder="Deskripsi singkat untuk mesin pencari..."
                                    />
                                    {errors.meta_description && (
                                        <p className="mt-1.5 text-xs text-destructive">
                                            {errors.meta_description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="content">
                                        Konten (HTML)
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData('content', e.target.value)
                                        }
                                        className="mt-2 font-mono text-sm"
                                        rows={20}
                                        placeholder="<h2>Judul</h2><p>Konten...</p>"
                                    />
                                    {errors.content && (
                                        <p className="mt-1.5 text-xs text-destructive">
                                            {errors.content}
                                        </p>
                                    )}
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Gunakan tag HTML untuk memformat konten
                                        (h2, h3, p, ul, li, dll.)
                                    </p>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label htmlFor="is_active">
                                            Status Halaman
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Halaman aktif akan dapat diakses
                                            pengunjung
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/cms/pages">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="min-w-[140px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
