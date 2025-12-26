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
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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

// Chart colors for pie chart
const CHART_COLORS: Record<string, string> = {
    pending: '#EAB308', // yellow
    processing: '#3B82F6', // blue
    shipped: '#A855F7', // purple
    delivered: '#22C55E', // green
    cancelled: '#EF4444', // red
};

// Bar chart gradient colors for top products
const BAR_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

function formatShortCurrency(value: number): string {
    if (value >= 1000000000) {
        return `Rp ${(value / 1000000000).toFixed(1)} M`;
    }
    if (value >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    }
    if (value >= 1000) {
        return `Rp ${(value / 1000).toFixed(0)} Rb`;
    }
    return `Rp ${value}`;
}

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

    // Prepare pie chart data
    const pieChartData = salesByStatus.map((item) => ({
        name: item.label,
        value: item.count,
        status: item.status,
        total: item.total,
    }));

    // Prepare bar chart data for top products
    const barChartData = topProducts.slice(0, 5).map((product) => ({
        name:
            product.product_name.length > 20
                ? product.product_name.substring(0, 20) + '...'
                : product.product_name,
        fullName: product.product_name,
        quantity: product.total_quantity,
        revenue: product.total_revenue,
    }));

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
                    {/* Sales Chart - AreaChart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Grafik Penjualan</CardTitle>
                            <CardDescription>
                                Pendapatan harian dalam periode yang dipilih
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 sm:h-80">
                                {dailySales.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={dailySales}>
                                            <defs>
                                                <linearGradient
                                                    id="colorSales"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--chart-1)"
                                                        stopOpacity={0.4}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--chart-1)"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                            />
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    formatShortCurrency(value)
                                                }
                                                width={70}
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    formatCurrency(
                                                        Number(value) || 0,
                                                    ),
                                                    'Pendapatan',
                                                ]}
                                                labelFormatter={(label) =>
                                                    `Tanggal: ${label}`
                                                }
                                                contentStyle={{
                                                    backgroundColor:
                                                        'var(--card)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--foreground)',
                                                }}
                                                itemStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                                labelStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="total"
                                                stroke="var(--chart-1)"
                                                fillOpacity={1}
                                                fill="url(#colorSales)"
                                                strokeWidth={2}
                                                dot={{
                                                    r: 4,
                                                    fill: 'var(--chart-1)',
                                                    stroke: 'var(--chart-1)',
                                                    strokeWidth: 2,
                                                }}
                                                activeDot={{
                                                    r: 6,
                                                    fill: 'var(--chart-1)',
                                                    stroke: 'var(--chart-1)',
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada data penjualan
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales by Status - PieChart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Pesanan</CardTitle>
                            <CardDescription>
                                Distribusi pesanan berdasarkan status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pieChartData.length > 0 &&
                            pieChartData.some((d) => d.value > 0) ? (
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {pieChartData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                CHART_COLORS[
                                                                    entry.status
                                                                ] || '#8884d8'
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(
                                                    value,
                                                    _name,
                                                    props,
                                                ) => [
                                                    `${value} pesanan (${formatCurrency(props.payload.total)})`,
                                                    props.payload.name,
                                                ]}
                                                contentStyle={{
                                                    backgroundColor:
                                                        'var(--card)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--foreground)',
                                                }}
                                                itemStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                                labelStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                            />
                                            <Legend
                                                formatter={(value) => (
                                                    <span className="text-sm text-foreground">
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada data pesanan
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Products - BarChart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Produk Terlaris</CardTitle>
                            <CardDescription>
                                Top 5 produk dengan penjualan tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {barChartData.length > 0 ? (
                                <div className="h-72">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={barChartData}
                                            layout="vertical"
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                                horizontal={true}
                                                vertical={false}
                                            />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    formatShortCurrency(value)
                                                }
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={100}
                                            />
                                            <Tooltip
                                                formatter={(value, name) => {
                                                    if (name === 'revenue') {
                                                        return [
                                                            formatCurrency(
                                                                Number(value) ||
                                                                    0,
                                                            ),
                                                            'Pendapatan',
                                                        ];
                                                    }
                                                    return [value, name];
                                                }}
                                                labelFormatter={(label) => {
                                                    const item =
                                                        barChartData.find(
                                                            (d) =>
                                                                d.name ===
                                                                label,
                                                        );
                                                    return (
                                                        item?.fullName || label
                                                    );
                                                }}
                                                contentStyle={{
                                                    backgroundColor:
                                                        'var(--card)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--foreground)',
                                                }}
                                                itemStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                                labelStyle={{
                                                    color: 'var(--foreground)',
                                                }}
                                            />
                                            <Bar
                                                dataKey="revenue"
                                                radius={[0, 4, 4, 0]}
                                            >
                                                {barChartData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                BAR_COLORS[
                                                                    index %
                                                                        BAR_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada data penjualan
                                    </p>
                                </div>
                            )}
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
