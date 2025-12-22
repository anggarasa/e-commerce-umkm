import { MediaItem, MediaUploader } from '@/components/media-uploader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/routes/admin/products';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/admin/products',
    },
    {
        title: 'Tambah Produk',
        href: '/admin/products/create',
    },
];

interface ProductFormData {
    name: string;
    slug: string;
    category_id: string;
    price: string;
    stock: string;
    description: string;
    is_active: boolean;
    new_media: {
        file: File;
        type: 'image' | 'video';
        is_primary: boolean;
    }[];
}

export default function ProductsCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } =
        useForm<ProductFormData>({
            name: '',
            slug: '',
            category_id: '',
            price: '',
            stock: '',
            description: '',
            is_active: true,
            new_media: [],
        });

    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    const updateSlug = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setData((data) => ({ ...data, slug }));
    };

    const handleMediaChange = (items: MediaItem[]) => {
        setMediaItems(items);
        // Prepare data for submission
        // We map the MediaItems to the structure expected by the backend
        // Note: 'file' is the actual File object.
        const preparedMedia = items
            .filter((item) => item.file)
            .map((item) => ({
                file: item.file as File,
                type: item.type,
                is_primary: item.is_primary,
            }));
        setData('new_media', preparedMedia);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Tambah Produk Baru
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Isi detail produk di bawah ini untuk menambahkan
                            produk baru.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index.url()}>
                                <ChevronLeft className="mr-2 size-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button onClick={submit} disabled={processing}>
                            {processing ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 size-4" />
                            )}
                            Simpan Produk
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Detail utama produk Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Produk</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData('name', e.target.value);
                                            updateSlug(e.target.value);
                                        }}
                                        placeholder="Contoh: Sepatu Sneakers Running"
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
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        placeholder="sepatu-sneakers-running"
                                        required
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">
                                        Kategori
                                    </Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {errors.category_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi lengkap produk..."
                                        rows={5}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Harga & Stok</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Harga (Rp)
                                        </Label>
                                        <CurrencyInput
                                            id="price"
                                            value={data.price}
                                            onChange={(value) =>
                                                setData('price', value)
                                            }
                                            placeholder="0"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-destructive">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stok</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) =>
                                                setData('stock', e.target.value)
                                            }
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                        {errors.stock && (
                                            <p className="text-sm text-destructive">
                                                {errors.stock}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">
                                        Aktifkan Produk
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Media Produk</CardTitle>
                                <CardDescription>
                                    Unggah gambar atau video produk. Gambar
                                    pertama akan menjadi sampul utama.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MediaUploader
                                    media={mediaItems}
                                    onChange={handleMediaChange}
                                />
                                {errors.new_media && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {errors.new_media}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
