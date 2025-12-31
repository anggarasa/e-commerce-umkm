import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';
import {
    ChevronRight,
    Database,
    Eye,
    FileText,
    HelpCircle,
    Lock,
    Mail,
    Package,
    ScrollText,
    Share2,
    Shield,
    UserCheck,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

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
    categories: CategoryWithCount[];
    termsOfServiceSettings: Record<string, Setting>;
}

const getIconComponent = (
    iconName: string,
    className: string = 'h-5 w-5',
): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        database: <Database className={className} />,
        eye: <Eye className={className} />,
        lock: <Lock className={className} />,
        share2: <Share2 className={className} />,
        'user-check': <UserCheck className={className} />,
        mail: <Mail className={className} />,
        shield: <Shield className={className} />,
        'file-text': <FileText className={className} />,
    };
    return iconMap[iconName] || <HelpCircle className={className} />;
};

export default function TermsOfService({
    categories,
    termsOfServiceSettings,
}: Props) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string = ''): string => {
        return termsOfServiceSettings[key]?.value || defaultValue;
    };

    // Helper to parse JSON setting
    const parseJsonSetting = <T,>(key: string, defaultValue: T): T => {
        try {
            const value = termsOfServiceSettings[key]?.value;
            if (!value) return defaultValue;
            return JSON.parse(value);
        } catch {
            return defaultValue;
        }
    };

    // Get CMS data with defaults
    const heroTitle = getSetting(
        'terms_of_service_hero_title',
        'Syarat & Ketentuan',
    );
    const heroDescription = getSetting(
        'terms_of_service_hero_description',
        'Ketahui aturan penggunaan layanan kami untuk pengalaman berbelanja yang lebih baik.',
    );
    const lastUpdatedRaw = getSetting('terms_of_service_last_updated', '');
    const lastUpdated = lastUpdatedRaw
        ? new Date(lastUpdatedRaw).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          });

    const sections = parseJsonSetting<SectionItem[]>(
        'terms_of_service_sections',
        [],
    );

    const footerNote = getSetting(
        'terms_of_service_footer_note',
        'Dengan melakukan pemesanan di platform kami, Anda menyatakan telah membaca, memahami, dan menyetujui syarat dan ketentuan ini.',
    );

    const toggleSection = (id: string) => {
        setActiveSection(activeSection === id ? null : id);
    };

    return (
        <StorefrontLayout title="Syarat & Ketentuan" categories={categories}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ScrollText className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            {heroTitle.split(' ').length > 1 ? (
                                <>
                                    {heroTitle
                                        .split(' ')
                                        .slice(0, -1)
                                        .join(' ')}{' '}
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        {heroTitle.split(' ').slice(-1)}
                                    </span>
                                </>
                            ) : (
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    {heroTitle}
                                </span>
                            )}
                        </h1>
                        <p className="mb-4 text-lg text-muted-foreground">
                            {heroDescription}
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                            Terakhir diperbarui: {lastUpdated}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        {/* Quick Navigation */}
                        {sections.length > 0 && (
                            <div className="mb-12 rounded-2xl border border-border/50 bg-card p-6">
                                <h2 className="mb-4 text-lg font-semibold text-foreground">
                                    Daftar Isi
                                </h2>
                                <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                document
                                                    .getElementById(section.id)
                                                    ?.scrollIntoView({
                                                        behavior: 'smooth',
                                                    })
                                            }
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            {getIconComponent(
                                                section.icon,
                                                'h-4 w-4 shrink-0 text-primary',
                                            )}
                                            <span className="truncate">
                                                {section.title}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Sections */}
                        <div className="space-y-6">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30"
                                >
                                    <button
                                        onClick={() =>
                                            toggleSection(section.id)
                                        }
                                        className="flex w-full items-center justify-between p-6 text-left"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                {getIconComponent(section.icon)}
                                            </div>
                                            <h2 className="truncate text-lg font-semibold text-foreground">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <ChevronRight
                                            className={`ml-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                                activeSection === section.id
                                                    ? 'rotate-90'
                                                    : ''
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${
                                            activeSection === section.id
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t border-border/50 px-6 pt-4 pb-6">
                                                <div
                                                    className="rich-text-content break-words"
                                                    dangerouslySetInnerHTML={{
                                                        __html: section.content,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                            <Package className="mx-auto mb-4 h-8 w-8 text-primary" />
                            <p className="text-sm text-muted-foreground">
                                {footerNote}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
