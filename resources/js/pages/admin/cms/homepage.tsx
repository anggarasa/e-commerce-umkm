import { updateHomepage } from '@/actions/App/Http/Controllers/Admin/CMSController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Headphones,
    HelpCircle,
    Home,
    Loader2,
    Plus,
    Save,
    Shield,
    Star,
    Trash2,
    Truck,
} from 'lucide-react';
import { FormEventHandler, ReactNode } from 'react';

interface Setting {
    key: string;
    value: string | null;
    type: string;
    group: string;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface Props {
    settings: Record<string, Setting>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'CMS',
        href: '/admin/cms/homepage',
    },
    {
        title: 'Pengaturan Homepage',
        href: '/admin/cms/homepage',
    },
];

const iconOptions = [
    { value: 'truck', label: 'Truk', icon: <Truck className="size-4" /> },
    { value: 'shield', label: 'Shield', icon: <Shield className="size-4" /> },
    {
        value: 'headphones',
        label: 'Headphones',
        icon: <Headphones className="size-4" />,
    },
    { value: 'star', label: 'Bintang', icon: <Star className="size-4" /> },
];

const getIconComponent = (iconName: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        truck: <Truck className="size-4" />,
        shield: <Shield className="size-4" />,
        headphones: <Headphones className="size-4" />,
        star: <Star className="size-4" />,
    };
    return iconMap[iconName] || <HelpCircle className="size-4" />;
};

export default function HomepageCMS({ settings }: Props) {
    const parseFeatures = (): Feature[] => {
        try {
            const featuresValue = settings.features?.value;
            if (!featuresValue) return [];
            return JSON.parse(featuresValue);
        } catch {
            return [];
        }
    };

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        hero_badge: settings.hero_badge?.value || '',
        hero_title: settings.hero_title?.value || '',
        hero_description: settings.hero_description?.value || '',
        hero_cta_primary: settings.hero_cta_primary?.value || '',
        hero_cta_secondary: settings.hero_cta_secondary?.value || '',
        features: parseFeatures(),
        cta_title: settings.cta_title?.value || '',
        cta_description: settings.cta_description?.value || '',
        cta_button_text: settings.cta_button_text?.value || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(updateHomepage.url());
    };

    const addFeature = () => {
        setData('features', [
            ...data.features,
            { icon: 'star', title: '', description: '' },
        ]);
    };

    const removeFeature = (index: number) => {
        setData(
            'features',
            data.features.filter((_, i) => i !== index),
        );
    };

    const updateFeature = (
        index: number,
        field: keyof Feature,
        value: string,
    ) => {
        const newFeatures = [...data.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setData('features', newFeatures);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Homepage" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pengaturan Homepage
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola konten yang ditampilkan di halaman utama website
                    </p>
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
                            Pengaturan homepage berhasil disimpan!
                        </AlertDescription>
                    </Alert>
                </Transition>

                <form onSubmit={submit} className="space-y-6">
                    {/* Hero Section */}
                    <Card>
                        <CardHeader icon={<Home className="size-5" />}>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>
                                Bagian utama yang pertama kali dilihat
                                pengunjung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="hero_badge">Badge</Label>
                                    <Input
                                        id="hero_badge"
                                        value={data.hero_badge}
                                        onChange={(e) =>
                                            setData(
                                                'hero_badge',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Platform E-commerce Terbaik"
                                        className="mt-2"
                                    />
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Teks badge di atas judul
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="hero_title">Judul</Label>
                                    <Input
                                        id="hero_title"
                                        value={data.hero_title}
                                        onChange={(e) =>
                                            setData(
                                                'hero_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Temukan Produk Berkualitas"
                                        className="mt-2"
                                    />
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Judul utama hero section
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="hero_description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="hero_description"
                                        value={data.hero_description}
                                        onChange={(e) =>
                                            setData(
                                                'hero_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi singkat tentang toko..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Deskripsi di bawah judul
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="hero_cta_primary">
                                        Tombol Utama
                                    </Label>
                                    <Input
                                        id="hero_cta_primary"
                                        value={data.hero_cta_primary}
                                        onChange={(e) =>
                                            setData(
                                                'hero_cta_primary',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Mulai Belanja"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="hero_cta_secondary">
                                        Tombol Sekunder
                                    </Label>
                                    <Input
                                        id="hero_cta_secondary"
                                        value={data.hero_cta_secondary}
                                        onChange={(e) =>
                                            setData(
                                                'hero_cta_secondary',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Lihat Katalog"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features Section */}
                    <Card>
                        <CardHeader icon={<Star className="size-5" />}>
                            <CardTitle>Features Section</CardTitle>
                            <CardDescription>
                                Fitur-fitur unggulan yang ditampilkan di
                                homepage
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 rounded-lg border p-4"
                                    >
                                        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                            <div>
                                                <Label>Icon</Label>
                                                <Select
                                                    value={feature.icon}
                                                    onValueChange={(value) =>
                                                        updateFeature(
                                                            index,
                                                            'icon',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="mt-2">
                                                        <SelectValue placeholder="Pilih icon">
                                                            <div className="flex items-center gap-2">
                                                                {getIconComponent(
                                                                    feature.icon,
                                                                )}
                                                                <span className="capitalize">
                                                                    {
                                                                        feature.icon
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {iconOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {
                                                                            option.icon
                                                                        }
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </div>
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Judul</Label>
                                                <Input
                                                    value={feature.title}
                                                    onChange={(e) =>
                                                        updateFeature(
                                                            index,
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Pengiriman Cepat"
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label>Deskripsi</Label>
                                                <Input
                                                    value={feature.description}
                                                    onChange={(e) =>
                                                        updateFeature(
                                                            index,
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ke seluruh Indonesia"
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 text-destructive hover:text-destructive"
                                            onClick={() => removeFeature(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addFeature}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Tambah Fitur
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA Section */}
                    <Card>
                        <CardHeader icon={<Star className="size-5" />}>
                            <CardTitle>CTA Section</CardTitle>
                            <CardDescription>
                                Bagian Call to Action di bagian bawah homepage
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="cta_title">Judul CTA</Label>
                                    <Input
                                        id="cta_title"
                                        value={data.cta_title}
                                        onChange={(e) =>
                                            setData('cta_title', e.target.value)
                                        }
                                        placeholder="Siap untuk Berbelanja?"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="cta_description">
                                        Deskripsi CTA
                                    </Label>
                                    <Textarea
                                        id="cta_description"
                                        value={data.cta_description}
                                        onChange={(e) =>
                                            setData(
                                                'cta_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Temukan ribuan produk berkualitas..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cta_button_text">
                                        Teks Tombol
                                    </Label>
                                    <Input
                                        id="cta_button_text"
                                        value={data.cta_button_text}
                                        onChange={(e) =>
                                            setData(
                                                'cta_button_text',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelajahi Produk"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
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
