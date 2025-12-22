import {
    ActionCard,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    StatCard,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
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

                {/* Stats Grid - Using StatCard component */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pendapatan"
                        value="Rp 45,2 Jt"
                        change="+12.5%"
                        changeType="positive"
                        icon={<TrendingUp />}
                    />
                    <StatCard
                        title="Total Pesanan"
                        value="1,234"
                        change="+8.2%"
                        changeType="positive"
                        icon={<ShoppingCart />}
                    />
                    <StatCard
                        title="Total Produk"
                        value="567"
                        change="+3.1%"
                        changeType="positive"
                        icon={<Package />}
                    />
                    <StatCard
                        title="Total Pelanggan"
                        value="2,345"
                        change="+15.3%"
                        changeType="positive"
                        icon={<Users />}
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid flex-1 gap-6 lg:grid-cols-3">
                    {/* Chart/Activity Section */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Grafik Penjualan</CardTitle>
                                <CardDescription>
                                    Performa penjualan 30 hari terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                    <p className="text-sm text-muted-foreground">
                                        Grafik penjualan akan ditampilkan di
                                        sini
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions - Using ActionCard component */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Aksi Cepat
                        </h2>
                        <div className="flex flex-col gap-3">
                            <ActionCard
                                title="Tambah Produk Baru"
                                description="Buat produk baru di katalog"
                                icon={<Package />}
                            />
                            <ActionCard
                                title="Lihat Pesanan"
                                description="Kelola pesanan pelanggan"
                                icon={<ShoppingCart />}
                            />
                            <ActionCard
                                title="Kelola Pelanggan"
                                description="Lihat data pelanggan"
                                icon={<Users />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
