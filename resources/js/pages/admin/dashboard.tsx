import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
    const changeColors = {
        positive: 'text-success bg-success/10',
        negative: 'text-destructive bg-destructive/10',
        neutral: 'text-muted-foreground bg-muted',
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {icon}
                    </div>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${changeColors[changeType]}`}
                    >
                        {changeType === 'positive' && (
                            <TrendingUp className="size-3" />
                        )}
                        {change}
                    </span>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function QuickActionCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <button className="group relative flex flex-col items-start gap-4 rounded-xl border border-border/50 bg-card p-5 text-left transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </button>
    );
}

export default function Dashboard() {
    const stats: StatCardProps[] = [
        {
            title: 'Total Pendapatan',
            value: 'Rp 45,2 Jt',
            change: '+12.5%',
            changeType: 'positive',
            icon: <TrendingUp className="size-6" />,
        },
        {
            title: 'Total Pesanan',
            value: '1,234',
            change: '+8.2%',
            changeType: 'positive',
            icon: <ShoppingCart className="size-6" />,
        },
        {
            title: 'Total Produk',
            value: '567',
            change: '+3.1%',
            changeType: 'positive',
            icon: <Package className="size-6" />,
        },
        {
            title: 'Total Pelanggan',
            value: '2,345',
            change: '+15.3%',
            changeType: 'positive',
            icon: <Users className="size-6" />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Selamat Datang Kembali! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Berikut adalah ringkasan bisnis Anda hari ini.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid flex-1 gap-6 lg:grid-cols-3">
                    {/* Chart/Activity Section */}
                    <div className="lg:col-span-2">
                        <div className="h-full rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Grafik Penjualan
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Performa penjualan 30 hari terakhir
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                <p className="text-sm text-muted-foreground">
                                    Grafik penjualan akan ditampilkan di sini
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Aksi Cepat
                        </h2>
                        <div className="flex flex-col gap-3">
                            <QuickActionCard
                                title="Tambah Produk Baru"
                                description="Buat produk baru di katalog"
                                icon={<Package className="size-5" />}
                            />
                            <QuickActionCard
                                title="Lihat Pesanan"
                                description="Kelola pesanan pelanggan"
                                icon={<ShoppingCart className="size-5" />}
                            />
                            <QuickActionCard
                                title="Kelola Pelanggan"
                                description="Lihat data pelanggan"
                                icon={<Users className="size-5" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
