import {
    edit,
    index,
    update,
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface Props {
    category: Category;
    parentCategories: Pick<Category, 'id' | 'name'>[];
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function CategoriesEdit({ category, parentCategories }: Props) {
    const [name, setName] = useState(category.name);
    const [slug, setSlug] = useState(category.slug);
    const [icon, setIcon] = useState(category.icon || '');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const slugManuallyEdited = useRef(true); // Start true for edit mode

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kategori',
            href: index().url,
        },
        {
            title: category.name,
            href: edit(category.slug).url,
        },
    ];

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
        router.put(update(category.slug).url, data, {
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Kategori
                        </h1>
                        <p className="text-muted-foreground">
                            Ubah detail kategori "{category.name}"
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informasi Kategori</CardTitle>
                        <CardDescription>
                            Ubah detail kategori produk
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="parent_id">
                                    Kategori Induk
                                </Label>
                                <Select
                                    name="parent_id"
                                    defaultValue={
                                        category.parent_id || undefined
                                    }
                                >
                                    <SelectTrigger id="parent_id">
                                        <SelectValue placeholder="Pilih kategori induk (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parentCategories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.name}
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

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Kategori *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) =>
                                        handleNameChange(e.target.value)
                                    }
                                    placeholder="Contoh: Elektronik"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL: /categories/{slug}
                                </p>
                                {errors.slug && (
                                    <p className="text-sm text-destructive">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Ikon</Label>
                                <IconPicker value={icon} onChange={setIcon} />
                                {errors.icon && (
                                    <p className="text-sm text-destructive">
                                        {errors.icon}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Deskripsi kategori (opsional)"
                                    defaultValue={category.description || ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked={category.is_active}
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer"
                                >
                                    Aktif
                                </Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    )}
                                    Simpan Perubahan
                                </Button>
                                <Button variant="outline" asChild>
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
