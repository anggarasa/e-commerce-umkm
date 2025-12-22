import {
    create,
    index,
    store,
} from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface Props {
    parentCategories: Pick<Category, 'id' | 'name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: index().url,
    },
    {
        title: 'Tambah Kategori',
        href: create().url,
    },
];

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function CategoriesCreate({ parentCategories }: Props) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const slugManuallyEdited = useRef(false);

    const handleNameChange = (value: string) => {
        setName(value);
        if (!slugManuallyEdited.current) {
            setSlug(generateSlug(value));
        }
    };

    const handleSlugChange = (value: string) => {
        setSlug(generateSlug(value));
        slugManuallyEdited.current = true;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.icon = icon;
        data.is_active = formData.has('is_active') ? '1' : '0';

        setProcessing(true);
        router.post(store().url, data, {
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="shrink-0"
                    >
                        <Link href={index().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Tambah Kategori
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Buat kategori produk baru untuk katalog Anda
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="max-w-2xl">
                    <CardHeader bordered>
                        <CardTitle className="text-lg">
                            Informasi Kategori
                        </CardTitle>
                        <CardDescription>
                            Isi detail kategori produk dengan lengkap
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Parent Category */}
                            <div className="space-y-2">
                                <Label htmlFor="parent_id">
                                    Kategori Induk
                                    <span className="ml-1 text-xs text-muted-foreground">
                                        (opsional)
                                    </span>
                                </Label>
                                <Select name="parent_id">
                                    <SelectTrigger id="parent_id">
                                        <SelectValue placeholder="Pilih kategori induk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parentCategories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.parent_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama Kategori
                                    <span className="ml-1 text-destructive">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) =>
                                        handleNameChange(e.target.value)
                                    }
                                    placeholder="Contoh: Elektronik"
                                    required
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) =>
                                        handleSlugChange(e.target.value)
                                    }
                                    placeholder="contoh: elektronik"
                                    aria-invalid={!!errors.slug}
                                />
                                <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                                    URL:{' '}
                                    <code className="font-mono text-foreground">
                                        /categories/
                                        {slug || 'nama-kategori'}
                                    </code>
                                </p>
                                {errors.slug && (
                                    <p className="text-sm text-destructive">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>

                            {/* Icon */}
                            <div className="space-y-2">
                                <Label>Ikon</Label>
                                <IconPicker value={icon} onChange={setIcon} />
                                {errors.icon && (
                                    <p className="text-sm text-destructive">
                                        {errors.icon}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Deskripsi
                                    <span className="ml-1 text-xs text-muted-foreground">
                                        (opsional)
                                    </span>
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Jelaskan kategori ini secara singkat..."
                                    rows={3}
                                    aria-invalid={!!errors.description}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked
                                />
                                <div className="flex flex-col">
                                    <Label
                                        htmlFor="is_active"
                                        className="cursor-pointer text-sm font-medium"
                                    >
                                        Aktifkan kategori ini
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Kategori aktif akan ditampilkan di toko
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="size-4" />
                                            Simpan Kategori
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" asChild size="lg">
                                    <Link href={index().url}>Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
