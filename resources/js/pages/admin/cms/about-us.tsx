import { updateAboutUs } from '@/actions/App/Http/Controllers/Admin/CMSController';
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
    Award,
    BarChart3,
    Box,
    CheckCircle2,
    Clock,
    CreditCard,
    Gift,
    Globe,
    Headphones,
    Heart,
    HelpCircle,
    Home,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Phone,
    Plus,
    RefreshCcw,
    Save,
    Shield,
    Star,
    Tag,
    Target,
    ThumbsUp,
    Trash2,
    Truck,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import { FormEventHandler, ReactNode } from 'react';

interface Setting {
    key: string;
    value: string | null;
    type: string;
    group: string;
}

interface StatItem {
    value: string;
    label: string;
}

interface ValueItem {
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
        title: 'Tentang Kami',
        href: '/admin/cms/about-us',
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
    {
        value: 'credit-card',
        label: 'Pembayaran',
        icon: <CreditCard className="size-4" />,
    },
    {
        value: 'refresh-ccw',
        label: 'Pengembalian',
        icon: <RefreshCcw className="size-4" />,
    },
    { value: 'box', label: 'Paket', icon: <Box className="size-4" /> },
    { value: 'map-pin', label: 'Lokasi', icon: <MapPin className="size-4" /> },
    { value: 'clock', label: 'Waktu', icon: <Clock className="size-4" /> },
    { value: 'gift', label: 'Hadiah', icon: <Gift className="size-4" /> },
    { value: 'lock', label: 'Keamanan', icon: <Lock className="size-4" /> },
    { value: 'phone', label: 'Telepon', icon: <Phone className="size-4" /> },
    { value: 'mail', label: 'Email', icon: <Mail className="size-4" /> },
    {
        value: 'award',
        label: 'Penghargaan',
        icon: <Award className="size-4" />,
    },
    {
        value: 'thumbs-up',
        label: 'Jempol',
        icon: <ThumbsUp className="size-4" />,
    },
    { value: 'wallet', label: 'Dompet', icon: <Wallet className="size-4" /> },
    { value: 'zap', label: 'Cepat', icon: <Zap className="size-4" /> },
    { value: 'globe', label: 'Global', icon: <Globe className="size-4" /> },
    { value: 'heart', label: 'Favorit', icon: <Heart className="size-4" /> },
    { value: 'tag', label: 'Label', icon: <Tag className="size-4" /> },
    { value: 'users', label: 'Users', icon: <Users className="size-4" /> },
    { value: 'target', label: 'Target', icon: <Target className="size-4" /> },
];

const getIconComponent = (iconName: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        truck: <Truck className="size-4" />,
        shield: <Shield className="size-4" />,
        headphones: <Headphones className="size-4" />,
        star: <Star className="size-4" />,
        'credit-card': <CreditCard className="size-4" />,
        'refresh-ccw': <RefreshCcw className="size-4" />,
        box: <Box className="size-4" />,
        'map-pin': <MapPin className="size-4" />,
        clock: <Clock className="size-4" />,
        gift: <Gift className="size-4" />,
        lock: <Lock className="size-4" />,
        phone: <Phone className="size-4" />,
        mail: <Mail className="size-4" />,
        award: <Award className="size-4" />,
        'thumbs-up': <ThumbsUp className="size-4" />,
        wallet: <Wallet className="size-4" />,
        zap: <Zap className="size-4" />,
        globe: <Globe className="size-4" />,
        heart: <Heart className="size-4" />,
        tag: <Tag className="size-4" />,
        users: <Users className="size-4" />,
        target: <Target className="size-4" />,
    };
    return iconMap[iconName] || <HelpCircle className="size-4" />;
};

export default function AboutUsCMS({ settings }: Props) {
    const parseJson = <T,>(key: string, defaultValue: T): T => {
        try {
            const value = settings[key]?.value;
            if (!value) return defaultValue;
            return JSON.parse(value);
        } catch {
            return defaultValue;
        }
    };

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        about_us_hero_badge: settings.about_us_hero_badge?.value || '',
        about_us_hero_title: settings.about_us_hero_title?.value || '',
        about_us_hero_description:
            settings.about_us_hero_description?.value || '',
        about_us_stats: parseJson<StatItem[]>('about_us_stats', []),
        about_us_vision_title: settings.about_us_vision_title?.value || '',
        about_us_vision_description:
            settings.about_us_vision_description?.value || '',
        about_us_mission_title: settings.about_us_mission_title?.value || '',
        about_us_mission_items: parseJson<string[]>(
            'about_us_mission_items',
            [],
        ),
        about_us_values_title: settings.about_us_values_title?.value || '',
        about_us_values_description:
            settings.about_us_values_description?.value || '',
        about_us_values: parseJson<ValueItem[]>('about_us_values', []),
        about_us_features_title: settings.about_us_features_title?.value || '',
        about_us_features_description:
            settings.about_us_features_description?.value || '',
        about_us_features: parseJson<ValueItem[]>('about_us_features', []),
        about_us_cta_title: settings.about_us_cta_title?.value || '',
        about_us_cta_description:
            settings.about_us_cta_description?.value || '',
        about_us_cta_button_text:
            settings.about_us_cta_button_text?.value || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(updateAboutUs.url());
    };

    // Stats handlers
    const addStat = () => {
        setData('about_us_stats', [
            ...data.about_us_stats,
            { value: '', label: '' },
        ]);
    };

    const removeStat = (index: number) => {
        setData(
            'about_us_stats',
            data.about_us_stats.filter((_, i) => i !== index),
        );
    };

    const updateStat = (
        index: number,
        field: keyof StatItem,
        value: string,
    ) => {
        const newStats = [...data.about_us_stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setData('about_us_stats', newStats);
    };

    // Mission items handlers
    const addMissionItem = () => {
        setData('about_us_mission_items', [...data.about_us_mission_items, '']);
    };

    const removeMissionItem = (index: number) => {
        setData(
            'about_us_mission_items',
            data.about_us_mission_items.filter((_, i) => i !== index),
        );
    };

    const updateMissionItem = (index: number, value: string) => {
        const newItems = [...data.about_us_mission_items];
        newItems[index] = value;
        setData('about_us_mission_items', newItems);
    };

    // Values handlers
    const addValue = () => {
        setData('about_us_values', [
            ...data.about_us_values,
            { icon: 'star', title: '', description: '' },
        ]);
    };

    const removeValue = (index: number) => {
        setData(
            'about_us_values',
            data.about_us_values.filter((_, i) => i !== index),
        );
    };

    const updateValue = (
        index: number,
        field: keyof ValueItem,
        value: string,
    ) => {
        const newValues = [...data.about_us_values];
        newValues[index] = { ...newValues[index], [field]: value };
        setData('about_us_values', newValues);
    };

    // Features handlers
    const addFeature = () => {
        setData('about_us_features', [
            ...data.about_us_features,
            { icon: 'star', title: '', description: '' },
        ]);
    };

    const removeFeature = (index: number) => {
        setData(
            'about_us_features',
            data.about_us_features.filter((_, i) => i !== index),
        );
    };

    const updateFeature = (
        index: number,
        field: keyof ValueItem,
        value: string,
    ) => {
        const newFeatures = [...data.about_us_features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setData('about_us_features', newFeatures);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Tentang Kami" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pengaturan Tentang Kami
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola konten yang ditampilkan di halaman Tentang Kami
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
                            Pengaturan Tentang Kami berhasil disimpan!
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
                                    <Label htmlFor="about_us_hero_badge">
                                        Badge
                                    </Label>
                                    <Input
                                        id="about_us_hero_badge"
                                        value={data.about_us_hero_badge}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_hero_badge',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="E-Commerce Terpercaya"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_hero_title">
                                        Judul
                                    </Label>
                                    <Input
                                        id="about_us_hero_title"
                                        value={data.about_us_hero_title}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_hero_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tentang Kami"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_hero_description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="about_us_hero_description"
                                        value={data.about_us_hero_description}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_hero_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi singkat tentang perusahaan..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Section */}
                    <Card>
                        <CardHeader icon={<BarChart3 className="size-5" />}>
                            <CardTitle>Statistik</CardTitle>
                            <CardDescription>
                                Angka-angka pencapaian yang ditampilkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.about_us_stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 rounded-lg border p-4"
                                    >
                                        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <Label>Nilai</Label>
                                                <Input
                                                    value={stat.value}
                                                    onChange={(e) =>
                                                        updateStat(
                                                            index,
                                                            'value',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="10K+"
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label>Label</Label>
                                                <Input
                                                    value={stat.label}
                                                    onChange={(e) =>
                                                        updateStat(
                                                            index,
                                                            'label',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Produk Tersedia"
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 text-destructive hover:text-destructive"
                                            onClick={() => removeStat(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addStat}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Tambah Statistik
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vision & Mission Section */}
                    <Card>
                        <CardHeader icon={<Target className="size-5" />}>
                            <CardTitle>Visi & Misi</CardTitle>
                            <CardDescription>
                                Visi dan misi perusahaan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Vision */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">Visi</h4>
                                    <div>
                                        <Label htmlFor="about_us_vision_title">
                                            Judul Visi
                                        </Label>
                                        <Input
                                            id="about_us_vision_title"
                                            value={data.about_us_vision_title}
                                            onChange={(e) =>
                                                setData(
                                                    'about_us_vision_title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Visi Kami"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="about_us_vision_description">
                                            Deskripsi Visi
                                        </Label>
                                        <Textarea
                                            id="about_us_vision_description"
                                            value={
                                                data.about_us_vision_description
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'about_us_vision_description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Deskripsi visi perusahaan..."
                                            className="mt-2"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                {/* Mission */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">Misi</h4>
                                    <div>
                                        <Label htmlFor="about_us_mission_title">
                                            Judul Misi
                                        </Label>
                                        <Input
                                            id="about_us_mission_title"
                                            value={data.about_us_mission_title}
                                            onChange={(e) =>
                                                setData(
                                                    'about_us_mission_title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Misi Kami"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Item Misi</Label>
                                        <div className="mt-2 space-y-2">
                                            {data.about_us_mission_items.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        <Input
                                                            value={item}
                                                            onChange={(e) =>
                                                                updateMissionItem(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Item misi..."
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="shrink-0 text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                removeMissionItem(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addMissionItem}
                                            >
                                                <Plus className="mr-2 size-4" />
                                                Tambah Item Misi
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Values Section */}
                    <Card>
                        <CardHeader icon={<Heart className="size-5" />}>
                            <CardTitle>Nilai-Nilai</CardTitle>
                            <CardDescription>
                                Nilai-nilai yang dipegang perusahaan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="about_us_values_title">
                                        Judul Section
                                    </Label>
                                    <Input
                                        id="about_us_values_title"
                                        value={data.about_us_values_title}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_values_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Mengapa Memilih Kami?"
                                        className="mt-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_values_description">
                                        Deskripsi Section
                                    </Label>
                                    <Textarea
                                        id="about_us_values_description"
                                        value={data.about_us_values_description}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_values_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi nilai-nilai..."
                                        className="mt-2"
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {data.about_us_values.map((value, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 rounded-lg border p-4"
                                    >
                                        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                            <div>
                                                <Label>Icon</Label>
                                                <Select
                                                    value={value.icon}
                                                    onValueChange={(v) =>
                                                        updateValue(
                                                            index,
                                                            'icon',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="mt-2">
                                                        <SelectValue placeholder="Pilih icon">
                                                            <div className="flex items-center gap-2">
                                                                {getIconComponent(
                                                                    value.icon,
                                                                )}
                                                                <span className="capitalize">
                                                                    {value.icon}
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
                                                    value={value.title}
                                                    onChange={(e) =>
                                                        updateValue(
                                                            index,
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Kualitas Terjamin"
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label>Deskripsi</Label>
                                                <Input
                                                    value={value.description}
                                                    onChange={(e) =>
                                                        updateValue(
                                                            index,
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Deskripsi nilai..."
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 text-destructive hover:text-destructive"
                                            onClick={() => removeValue(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addValue}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Tambah Nilai
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features Section */}
                    <Card>
                        <CardHeader icon={<Star className="size-5" />}>
                            <CardTitle>Keunggulan</CardTitle>
                            <CardDescription>
                                Fitur-fitur unggulan platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="about_us_features_title">
                                        Judul Section
                                    </Label>
                                    <Input
                                        id="about_us_features_title"
                                        value={data.about_us_features_title}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_features_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Keunggulan Platform"
                                        className="mt-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_features_description">
                                        Deskripsi Section
                                    </Label>
                                    <Textarea
                                        id="about_us_features_description"
                                        value={
                                            data.about_us_features_description
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'about_us_features_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi keunggulan..."
                                        className="mt-2"
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {data.about_us_features.map(
                                    (feature, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-4 rounded-lg border p-4"
                                        >
                                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <Label>Icon</Label>
                                                    <Select
                                                        value={feature.icon}
                                                        onValueChange={(v) =>
                                                            updateFeature(
                                                                index,
                                                                'icon',
                                                                v,
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
                                                        placeholder="Beragam Produk"
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Deskripsi</Label>
                                                    <Input
                                                        value={
                                                            feature.description
                                                        }
                                                        onChange={(e) =>
                                                            updateFeature(
                                                                index,
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Koleksi lengkap dari berbagai kategori"
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    removeFeature(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ),
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addFeature}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Tambah Keunggulan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA Section */}
                    <Card>
                        <CardHeader icon={<Star className="size-5" />}>
                            <CardTitle>CTA Section</CardTitle>
                            <CardDescription>
                                Bagian Call to Action di bagian bawah halaman
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_cta_title">
                                        Judul CTA
                                    </Label>
                                    <Input
                                        id="about_us_cta_title"
                                        value={data.about_us_cta_title}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_cta_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Siap Untuk Berbelanja?"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="about_us_cta_description">
                                        Deskripsi CTA
                                    </Label>
                                    <Textarea
                                        id="about_us_cta_description"
                                        value={data.about_us_cta_description}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_cta_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Temukan produk berkualitas..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="about_us_cta_button_text">
                                        Teks Tombol
                                    </Label>
                                    <Input
                                        id="about_us_cta_button_text"
                                        value={data.about_us_cta_button_text}
                                        onChange={(e) =>
                                            setData(
                                                'about_us_cta_button_text',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Lihat Produk"
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
