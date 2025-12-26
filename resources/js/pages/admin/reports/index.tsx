import {
    exportMethod,
    index as indexRoute,
} from '@/actions/App/Http/Controllers/Admin/ReportController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    StatCard,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { show as showOrderRoute } from '@/routes/admin/orders';
import { type BreadcrumbItem, type Order, type OrderStatuses } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Package,
    ShoppingBag,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface DailySale {
    date: string;
    label: string;
    total: number;
    orders: number;
}

interface TopProduct {
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
}

interface SalesByStatus {
    status: string;
    label: string;
    count: number;
    total: number;
}

interface Stats {
    total_revenue: number;
    total_orders: number;
    successful_orders: number;
    total_products_sold: number;
    pending_revenue: number;
    revenue_growth: number;
    orders_growth: number;
    average_order_value: number;
}

interface Props {
    stats: Stats;
    dailySales: DailySale[];
    topProducts: TopProduct[];
    recentOrders: Order[];
    salesByStatus: SalesByStatus[];
    filters: {
        period: string;
        date_from: string;
        date_to: string;
    };
    statuses: OrderStatuses;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/admin/reports',
    },
];

const periodOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '30days', label: '30 Hari Terakhir' },
    { value: 'this_month', label: 'Bulan Ini' },
    { value: 'last_month', label: 'Bulan Lalu' },
];

// Status badge colors
const statusColors: Record<string, string> = {
    pending:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ReportsIndex({
    stats,
    dailySales,
    topProducts,
    recentOrders,
    salesByStatus,
    filters,
    statuses,
}: Props) {
    const [period, setPeriod] = useState(filters.period);
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        router.visit(indexRoute.url(), {
            data: {
                period: value,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleCustomDateFilter = () => {
        router.visit(indexRoute.url(), {
            data: {
                period: 'custom',
                date_from: dateFrom,
                date_to: dateTo,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleExport = () => {
        window.location.href =
            exportMethod.url() +
            `?period=${period}&date_from=${dateFrom}&date_to=${dateTo}`;
    };

    // Calculate max value for chart scaling
    const maxSalesValue = Math.max(...dailySales.map((d) => d.total), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Penjualan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Laporan Penjualan
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Analisis performa penjualan toko Anda
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={period}
                            onValueChange={handlePeriodChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Calendar className="mr-2 size-4" />
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                {periodOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleExport} variant="outline">
                            <Download className="mr-2 size-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Custom Date Range */}
                {period === 'custom' && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="flex-1">
                                    <label className="mb-2 block text-sm font-medium">
                                        Dari Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-2 block text-sm font-medium">
                                        Sampai Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <Button onClick={handleCustomDateFilter}>
                                    Terapkan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pendapatan"
                        value={formatCurrency(stats.total_revenue)}
                        change={`${stats.revenue_growth >= 0 ? '+' : ''}${stats.revenue_growth}%`}
                        changeType={
                            stats.revenue_growth >= 0 ? 'positive' : 'negative'
                        }
                        icon={<TrendingUp />}
                        description="Dari pesanan selesai"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={stats.total_orders.toString()}
                        change={`${stats.orders_growth >= 0 ? '+' : ''}${stats.orders_growth}%`}
                        changeType={
                            stats.orders_growth >= 0 ? 'positive' : 'negative'
                        }
                        icon={<ShoppingBag />}
                        description={`${stats.successful_orders} berhasil`}
                    />
                    <StatCard
                        title="Produk Terjual"
                        value={stats.total_products_sold.toString()}
                        icon={<Package />}
                        description="Unit terjual"
                    />
                    <StatCard
                        title="Rata-rata Pesanan"
                        value={formatCurrency(stats.average_order_value)}
                        icon={<Wallet />}
                        description="Per transaksi"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Sales Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Grafik Penjualan</CardTitle>
                            <CardDescription>
                                Pendapatan harian dalam periode yang dipilih
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-64 items-end gap-1">
                                {dailySales.map((day) => (
                                    <div
                                        key={day.date}
                                        className="group relative flex flex-1 flex-col items-center"
                                    >
                                        <div className="absolute -top-16 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs text-background group-hover:block">
                                            <div className="font-medium">
                                                {formatCurrency(day.total)}
                                            </div>
                                            <div className="text-xs opacity-80">
                                                {day.orders} pesanan
                                            </div>
                                        </div>
                                        <div
                                            className="w-full rounded-t-sm bg-primary/80 transition-all hover:bg-primary"
                                            style={{
                                                height: `${Math.max((day.total / maxSalesValue) * 100, 2)}%`,
                                            }}
                                        />
                                        {dailySales.length <= 14 && (
                                            <span className="mt-2 text-[10px] text-muted-foreground">
                                                {day.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Pesanan</CardTitle>
                            <CardDescription>
                                Distribusi pesanan berdasarkan status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {salesByStatus.map((item) => (
                                    <div
                                        key={item.status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[item.status] || ''}`}
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {item.count}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {salesByStatus.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Tidak ada data
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Produk Terlaris</CardTitle>
                            <CardDescription>
                                Produk dengan penjualan tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div
                                        key={product.product_id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-medium">
                                                {product.product_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {product.total_quantity} unit
                                                terjual
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    product.total_revenue,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {topProducts.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Belum ada data penjualan
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                            <CardDescription>
                                10 pesanan terakhir dalam periode ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={showOrderRoute.url(order.id)}
                                        className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                #{order.order_number}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {order.customer_name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    Number(order.total),
                                                )}
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || ''}`}
                                            >
                                                {statuses[order.status] ||
                                                    order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {recentOrders.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Tidak ada pesanan dalam periode ini
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Revenue Info */}
                {stats.pending_revenue > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
                                    <Wallet className="size-6" />
                                </div>
                                <div>
                                    <div className="font-semibold text-yellow-800 dark:text-yellow-400">
                                        Pendapatan Tertunda
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                                        {formatCurrency(stats.pending_revenue)}
                                    </div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-500">
                                        Dari pesanan yang belum selesai
                                        (pending, diproses, dikirim)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
