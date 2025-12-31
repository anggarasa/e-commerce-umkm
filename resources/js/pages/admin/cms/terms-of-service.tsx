import { updateTermsOfService } from '@/actions/App/Http/Controllers/Admin/CMSController';
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
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
    Database,
    Eye,
    FileText,
    HelpCircle,
    Loader2,
    Lock,
    Mail,
    Plus,
    Save,
    ScrollText,
    Share2,
    Shield,
    Trash2,
    UserCheck,
} from 'lucide-react';
import { FormEventHandler, ReactNode } from 'react';

interface Setting {
    key: string;
    value: string | null;
    type: string;
    group: string;
}

interface SectionItem {
    id: string;
    icon: string;
    title: string;
    content: string;
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
        title: 'Syarat & Ketentuan',
        href: '/admin/cms/terms-of-service',
    },
];

const iconOptions = [
    {
        value: 'database',
        label: 'Database',
        icon: <Database className="size-4" />,
    },
    { value: 'eye', label: 'Mata', icon: <Eye className="size-4" /> },
    { value: 'lock', label: 'Kunci', icon: <Lock className="size-4" /> },
    { value: 'share2', label: 'Berbagi', icon: <Share2 className="size-4" /> },
    {
        value: 'user-check',
        label: 'User Check',
        icon: <UserCheck className="size-4" />,
    },
    { value: 'mail', label: 'Email', icon: <Mail className="size-4" /> },
    { value: 'shield', label: 'Shield', icon: <Shield className="size-4" /> },
    {
        value: 'file-text',
        label: 'Dokumen',
        icon: <FileText className="size-4" />,
    },
];

const getIconComponent = (iconName: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        database: <Database className="size-4" />,
        eye: <Eye className="size-4" />,
        lock: <Lock className="size-4" />,
        share2: <Share2 className="size-4" />,
        'user-check': <UserCheck className="size-4" />,
        mail: <Mail className="size-4" />,
        shield: <Shield className="size-4" />,
        'file-text': <FileText className="size-4" />,
    };
    return iconMap[iconName] || <HelpCircle className="size-4" />;
};

export default function TermsOfServiceCMS({ settings }: Props) {
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
        terms_of_service_hero_title:
            settings.terms_of_service_hero_title?.value || '',
        terms_of_service_hero_description:
            settings.terms_of_service_hero_description?.value || '',
        terms_of_service_last_updated:
            settings.terms_of_service_last_updated?.value || '',
        terms_of_service_sections: parseJson<SectionItem[]>(
            'terms_of_service_sections',
            [],
        ),
        terms_of_service_footer_note:
            settings.terms_of_service_footer_note?.value || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(updateTermsOfService.url());
    };

    // Sections handlers
    const addSection = () => {
        setData('terms_of_service_sections', [
            ...data.terms_of_service_sections,
            {
                id: `section-${Date.now()}`,
                icon: 'shield',
                title: '',
                content: '',
            },
        ]);
    };

    const removeSection = (index: number) => {
        setData(
            'terms_of_service_sections',
            data.terms_of_service_sections.filter((_, i) => i !== index),
        );
    };

    const updateSection = (
        index: number,
        field: keyof SectionItem,
        value: string,
    ) => {
        const newSections = [...data.terms_of_service_sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setData('terms_of_service_sections', newSections);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Syarat & Ketentuan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pengaturan Syarat & Ketentuan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola konten yang ditampilkan di halaman Syarat &
                        Ketentuan
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
                            Pengaturan Syarat & Ketentuan berhasil disimpan!
                        </AlertDescription>
                    </Alert>
                </Transition>

                <form onSubmit={submit} className="space-y-6">
                    {/* Hero Section */}
                    <Card>
                        <CardHeader icon={<ScrollText className="size-5" />}>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>
                                Bagian utama yang pertama kali dilihat
                                pengunjung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="terms_of_service_hero_title">
                                        Judul
                                    </Label>
                                    <Input
                                        id="terms_of_service_hero_title"
                                        value={data.terms_of_service_hero_title}
                                        onChange={(e) =>
                                            setData(
                                                'terms_of_service_hero_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Syarat & Ketentuan"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="terms_of_service_hero_description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="terms_of_service_hero_description"
                                        value={
                                            data.terms_of_service_hero_description
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'terms_of_service_hero_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi singkat tentang syarat dan ketentuan..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="terms_of_service_last_updated">
                                        Terakhir Diperbarui
                                    </Label>
                                    <Input
                                        id="terms_of_service_last_updated"
                                        type="date"
                                        value={
                                            data.terms_of_service_last_updated
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'terms_of_service_last_updated',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sections */}
                    <Card>
                        <CardHeader icon={<FileText className="size-5" />}>
                            <CardTitle>Section Syarat & Ketentuan</CardTitle>
                            <CardDescription>
                                Bagian-bagian syarat dan ketentuan yang dapat
                                diperluas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.terms_of_service_sections.map(
                                    (section, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Section {index + 1}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        removeSection(index)
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div>
                                                    <Label>ID Section</Label>
                                                    <Input
                                                        value={section.id}
                                                        onChange={(e) =>
                                                            updateSection(
                                                                index,
                                                                'id',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="acceptance"
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Icon</Label>
                                                    <Select
                                                        value={section.icon}
                                                        onValueChange={(v) =>
                                                            updateSection(
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
                                                                        section.icon,
                                                                    )}
                                                                    <span className="capitalize">
                                                                        {
                                                                            section.icon
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
                                                        value={section.title}
                                                        onChange={(e) =>
                                                            updateSection(
                                                                index,
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="1. Penerimaan Syarat"
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Label>Konten</Label>
                                                <RichTextEditor
                                                    value={section.content}
                                                    onChange={(value) =>
                                                        updateSection(
                                                            index,
                                                            'content',
                                                            value,
                                                        )
                                                    }
                                                    placeholder="Tulis konten section di sini..."
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addSection}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Tambah Section
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Note */}
                    <Card>
                        <CardHeader icon={<FileText className="size-5" />}>
                            <CardTitle>Catatan Footer</CardTitle>
                            <CardDescription>
                                Pesan yang ditampilkan di bagian bawah halaman
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="terms_of_service_footer_note">
                                    Catatan
                                </Label>
                                <Textarea
                                    id="terms_of_service_footer_note"
                                    value={data.terms_of_service_footer_note}
                                    onChange={(e) =>
                                        setData(
                                            'terms_of_service_footer_note',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Dengan melakukan pemesanan di platform kami..."
                                    className="mt-2"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
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
