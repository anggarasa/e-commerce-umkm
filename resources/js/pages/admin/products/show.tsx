import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import {
    edit as editRoute,
    index,
    show as showRoute,
} from '@/routes/admin/products';
import { type BreadcrumbItem, type Product, type ProductMedia } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Calendar,
    ChevronLeft,
    Edit,
    Folder,
    ImageIcon,
    Package,
    PlayCircle,
    Tag,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: Product;
}

export default function ProductsShow({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produk',
            href: '/admin/products',
        },
        {
            title: product.name,
            href: showRoute.url(product.id),
        },
    ];

    const [selectedMedia, setSelectedMedia] = useState<ProductMedia | null>(
        () => {
            if (product.media && product.media.length > 0) {
                return (
                    product.media.find((m) => m.is_primary) || product.media[0]
                );
            }
            return null;
        },
    );

    const imageMedia = product.media?.filter((m) => m.type === 'image') || [];
    const videoMedia = product.media?.filter((m) => m.type === 'video') || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Produk - ${product.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={index.url()}>
                                <ChevronLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Detail Produk
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Informasi lengkap produk
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={editRoute.url(product.id)}>
                            <Edit className="mr-2 size-4" />
                            Edit Produk
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Media Gallery */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="size-5" />
                                    Galeri Media
                                </CardTitle>
                                <CardDescription>
                                    {product.media?.length || 0} media terdaftar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Main Display */}
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                                    {selectedMedia ? (
                                        selectedMedia.type === 'image' ? (
                                            <img
                                                src={selectedMedia.url}
                                                alt={product.name}
                                                className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <video
                                                src={selectedMedia.url}
                                                controls
                                                className="size-full object-contain"
                                            />
                                        )
                                    ) : (
                                        <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
                                            <Package className="mb-2 size-16 opacity-50" />
                                            <p className="text-sm">
                                                Tidak ada media
                                            </p>
                                        </div>
                                    )}
                                    {selectedMedia?.is_primary && (
                                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                            Utama
                                        </Badge>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {product.media && product.media.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {product.media.map((media) => (
                                            <button
                                                key={media.id}
                                                onClick={() =>
                                                    setSelectedMedia(media)
                                                }
                                                className={`relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 transition-all ${
                                                    selectedMedia?.id ===
                                                    media.id
                                                        ? 'border-primary ring-2 ring-primary/20'
                                                        : 'border-transparent hover:border-muted-foreground/30'
                                                }`}
                                            >
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt="Thumbnail"
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center bg-muted">
                                                        <PlayCircle className="size-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {media.is_primary && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                        <Tag className="size-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Media Stats */}
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <ImageIcon className="size-4" />
                                        {imageMedia.length} Gambar
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <PlayCircle className="size-4" />
                                        {videoMedia.length} Video
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">
                                            {product.name}
                                        </CardTitle>
                                        <p className="font-mono text-sm text-muted-foreground">
                                            {product.slug}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            product.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className={
                                            product.is_active
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : ''
                                        }
                                    >
                                        {product.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Price */}
                                <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Harga
                                    </p>
                                    <p className="text-3xl font-bold text-primary">
                                        {formatCurrency(Number(product.price))}
                                    </p>
                                </div>

                                <Separator />

                                {/* Category */}
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                        <Folder className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Kategori
                                        </p>
                                        <p className="font-medium">
                                            {product.category?.name || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                        <Box className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Stok Tersedia
                                        </p>
                                        <p className="font-medium">
                                            <span
                                                className={
                                                    product.stock > 10
                                                        ? 'text-green-600'
                                                        : product.stock > 0
                                                          ? 'text-amber-600'
                                                          : 'text-red-600'
                                                }
                                            >
                                                {product.stock}
                                            </span>{' '}
                                            unit
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deskripsi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {product.description ? (
                                    <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                        {product.description}
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        Tidak ada deskripsi
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="size-5" />
                                    Informasi Waktu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Dibuat pada
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(product.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Diperbarui pada
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(product.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
