import { update } from '@/actions/App/Http/Controllers/Admin/SettingController';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Facebook,
    FileText,
    Instagram,
    Link2,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Share2,
    Store,
    Twitter,
} from 'lucide-react';
import { FormEventHandler, ReactNode } from 'react';

interface Setting {
    key: string;
    value: string | null;
    type: string;
    group: string;
}

interface Props {
    settings: Record<string, Setting[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Toko',
        href: '/admin/settings',
    },
];

// Icon mapping untuk setiap field
const fieldIcons: Record<string, ReactNode> = {
    store_name: <Store className="size-4" />,
    store_description: <FileText className="size-4" />,
    store_address: <MapPin className="size-4" />,
    store_email: <Mail className="size-4" />,
    store_phone: <Phone className="size-4" />,
    social_facebook: <Facebook className="size-4" />,
    social_instagram: <Instagram className="size-4" />,
    social_twitter: <Twitter className="size-4" />,
    social_tiktok: <Link2 className="size-4" />,
};

// Helper text untuk setiap field
const fieldHelpers: Record<string, string> = {
    store_name: 'Nama toko yang akan ditampilkan di website',
    store_description: 'Deskripsi singkat tentang toko Anda',
    store_address: 'Alamat lengkap toko untuk ditampilkan di footer',
    store_email: 'Email untuk menerima notifikasi pesanan',
    store_phone: 'Nomor telepon yang dapat dihubungi pelanggan',
    social_facebook: 'URL halaman Facebook toko',
    social_instagram: 'URL profil Instagram toko',
    social_twitter: 'URL akun Twitter/X toko',
    social_tiktok: 'URL akun TikTok toko',
};

// Label display untuk setiap field
const fieldLabels: Record<string, string> = {
    store_name: 'Nama Toko',
    store_description: 'Deskripsi Toko',
    store_address: 'Alamat Toko',
    store_email: 'Email Toko',
    store_phone: 'Nomor Telepon',
    social_facebook: 'Facebook',
    social_instagram: 'Instagram',
    social_twitter: 'Twitter / X',
    social_tiktok: 'TikTok',
};

// Group configuration
const groupConfig: Record<
    string,
    { icon: ReactNode; title: string; description: string }
> = {
    general: {
        icon: <Building2 className="size-5" />,
        title: 'Informasi Umum',
        description: 'Pengaturan dasar identitas toko Anda',
    },
    social: {
        icon: <Share2 className="size-5" />,
        title: 'Media Sosial',
        description: 'Link ke akun media sosial toko',
    },
};

export default function Settings({ settings }: Props) {
    // Flatten settings for form initialization
    const initialSettings = Object.values(settings)
        .flat()
        .map((s) => ({
            key: s.key,
            value: s.value,
        }));

    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            settings: initialSettings,
        });

    const updateSetting = (key: string, value: string) => {
        const newSettings = data.settings.map((s) =>
            s.key === key ? { ...s, value } : s,
        );
        setData('settings', newSettings);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(update.url());
    };

    const getInputType = (key: string): string => {
        if (key.includes('email')) return 'email';
        if (key.includes('phone')) return 'tel';
        if (key.includes('social_')) return 'url';
        return 'text';
    };

    const getPlaceholder = (key: string): string => {
        const placeholders: Record<string, string> = {
            store_name: 'Contoh: Toko Saya',
            store_email: 'contoh@email.com',
            store_phone: '+62812345678',
            social_facebook: 'https://facebook.com/tokosaya',
            social_instagram: 'https://instagram.com/tokosaya',
            social_twitter: 'https://twitter.com/tokosaya',
            social_tiktok: 'https://tiktok.com/@tokosaya',
        };
        return placeholders[key] || '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Toko" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pengaturan Toko
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola informasi dan konfigurasi toko Anda
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
                            Pengaturan berhasil disimpan!
                        </AlertDescription>
                    </Alert>
                </Transition>

                <form onSubmit={submit} className="space-y-6">
                    {Object.entries(settings).map(([group, groupSettings]) => {
                        const config = groupConfig[group] || {
                            icon: <Store className="size-5" />,
                            title:
                                group.charAt(0).toUpperCase() + group.slice(1),
                            description: `Pengaturan ${group}`,
                        };

                        return (
                            <Card key={group}>
                                <CardHeader icon={config.icon}>
                                    <CardTitle>{config.title}</CardTitle>
                                    <CardDescription>
                                        {config.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {groupSettings.map((setting) => {
                                            const isTextarea =
                                                setting.key ===
                                                    'store_description' ||
                                                setting.key === 'store_address';
                                            const icon =
                                                fieldIcons[setting.key];
                                            const helper =
                                                fieldHelpers[setting.key];
                                            const label =
                                                fieldLabels[setting.key] ||
                                                setting.key;

                                            return (
                                                <div
                                                    key={setting.key}
                                                    className={
                                                        isTextarea
                                                            ? 'md:col-span-2'
                                                            : ''
                                                    }
                                                >
                                                    <Label
                                                        htmlFor={setting.key}
                                                        className="mb-2 flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        {icon && (
                                                            <span className="text-muted-foreground">
                                                                {icon}
                                                            </span>
                                                        )}
                                                        {label}
                                                    </Label>

                                                    {isTextarea ? (
                                                        <Textarea
                                                            id={setting.key}
                                                            rows={3}
                                                            placeholder={
                                                                setting.key ===
                                                                'store_description'
                                                                    ? 'Masukkan deskripsi toko...'
                                                                    : 'Masukkan alamat lengkap...'
                                                            }
                                                            value={
                                                                data.settings.find(
                                                                    (s) =>
                                                                        s.key ===
                                                                        setting.key,
                                                                )?.value || ''
                                                            }
                                                            onChange={(e) =>
                                                                updateSetting(
                                                                    setting.key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="resize-none"
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={setting.key}
                                                            type={getInputType(
                                                                setting.key,
                                                            )}
                                                            placeholder={getPlaceholder(
                                                                setting.key,
                                                            )}
                                                            value={
                                                                data.settings.find(
                                                                    (s) =>
                                                                        s.key ===
                                                                        setting.key,
                                                                )?.value || ''
                                                            }
                                                            onChange={(e) =>
                                                                updateSetting(
                                                                    setting.key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}

                                                    {helper && (
                                                        <p className="mt-1.5 text-xs text-muted-foreground">
                                                            {helper}
                                                        </p>
                                                    )}

                                                    {(errors[
                                                        `settings.${data.settings.findIndex((s) => s.key === setting.key)}.value`
                                                    ] ||
                                                        errors[
                                                            `settings.${data.settings.findIndex((s) => s.key === setting.key)}.key`
                                                        ]) && (
                                                        <p className="mt-1.5 text-xs text-destructive">
                                                            {errors[
                                                                `settings.${data.settings.findIndex((s) => s.key === setting.key)}.value`
                                                            ] ||
                                                                errors[
                                                                    `settings.${data.settings.findIndex((s) => s.key === setting.key)}.key`
                                                                ]}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

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
