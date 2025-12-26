import { index as ordersIndex } from '@/actions/App/Http/Controllers/Admin/OrderController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    StatCard,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import ordersRoute from '@/routes/admin/orders';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Eye,
    FolderOpen,
    Package,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
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

interface RecentOrder {
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    status_label: string;
    formatted_order_number: string;
    created_at: string;
}

interface OrderByStatus {
    status: string;
    label: string;
    count: number;
}

interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_categories: number;
    revenue_growth: number;
    orders_growth: number;
}

interface DashboardProps {
    stats: DashboardStats;
    dailySales: DailySale[];
    recentOrders: RecentOrder[];
    ordersByStatus: OrderByStatus[];
    statuses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

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

function getGrowthChange(growth: number): {
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
} {
    if (growth > 0) {
        return { change: `+${growth}%`, changeType: 'positive' };
    }
    if (growth < 0) {
        return { change: `${growth}%`, changeType: 'negative' };
    }
    return { change: '0%', changeType: 'neutral' };
}

function getStatusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'pending':
            return 'secondary';
        case 'processing':
            return 'default';
        case 'shipped':
            return 'default';
        case 'delivered':
            return 'outline';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
}

// Status colors for badge styling
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

export default function Dashboard({
    stats,
    dailySales,
    recentOrders,
    ordersByStatus,
}: DashboardProps) {
    const revenueGrowth = getGrowthChange(stats.revenue_growth);
    const ordersGrowth = getGrowthChange(stats.orders_growth);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Selamat Datang Kembali! 👋
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Berikut adalah ringkasan bisnis Anda 30 hari terakhir.
                    </p>
                </div>

                {/* Stats Grid - 4 equal cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pendapatan"
                        value={formatShortCurrency(stats.total_revenue)}
                        change={revenueGrowth.change}
                        changeType={revenueGrowth.changeType}
                        icon={<TrendingUp />}
                        className="h-full"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={stats.total_orders.toLocaleString('id-ID')}
                        change={ordersGrowth.change}
                        changeType={ordersGrowth.changeType}
                        icon={<ShoppingCart />}
                        className="h-full"
                    />
                    <StatCard
                        title="Produk Aktif"
                        value={stats.total_products.toLocaleString('id-ID')}
                        icon={<Package />}
                        className="h-full"
                    />
                    <StatCard
                        title="Kategori Aktif"
                        value={stats.total_categories.toLocaleString('id-ID')}
                        icon={<FolderOpen />}
                        className="h-full"
                    />
                </div>

                {/* Main Content - Chart & Status Sidebar */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Sales Chart - 8 columns on large screens */}
                    <Card className="lg:col-span-8">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Grafik Penjualan
                            </CardTitle>
                            <CardDescription>
                                Performa penjualan 30 hari terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 sm:h-80">
                                {dailySales.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={dailySales}>
                                            <defs>
                                                <linearGradient
                                                    id="colorTotal"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--chart-1)"
                                                        stopOpacity={0.3}
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
                                                    'Penjualan',
                                                ]}
                                                labelFormatter={(label) =>
                                                    `Tanggal: ${label}`
                                                }
                                                contentStyle={{
                                                    backgroundColor:
                                                        'var(--card)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="total"
                                                stroke="var(--chart-1)"
                                                fillOpacity={1}
                                                fill="url(#colorTotal)"
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

                    {/* Order Status - 4 columns on large screens */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Status Pesanan
                            </CardTitle>
                            <CardDescription>
                                Ringkasan status pesanan saat ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ordersByStatus.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {ordersByStatus.map((item) => (
                                        <div
                                            key={item.status}
                                            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50"
                                        >
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status] || 'bg-muted text-muted-foreground'}`}
                                            >
                                                {item.label}
                                            </span>
                                            <span className="text-2xl font-bold text-foreground">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada pesanan
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                            <CardDescription>
                                5 pesanan terakhir
                            </CardDescription>
                        </div>
                        <Link href={ordersIndex().url}>
                            <Button variant="outline" size="sm">
                                Lihat Semua
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border/50">
                                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                                                    No. Pesanan
                                                </th>
                                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                                                    Pelanggan
                                                </th>
                                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                                                    Total
                                                </th>
                                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                                                    Status
                                                </th>
                                                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-border/30 last:border-0"
                                                >
                                                    <td className="py-3">
                                                        <span className="font-mono text-sm font-medium">
                                                            {
                                                                order.formatted_order_number
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm">
                                                            {
                                                                order.customer_name
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm font-medium">
                                                            {formatCurrency(
                                                                order.total,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge
                                                            variant={getStatusBadgeVariant(
                                                                order.status,
                                                            )}
                                                        >
                                                            {order.status_label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            href={
                                                                ordersRoute.show(
                                                                    order.id,
                                                                ).url
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={
                                                ordersRoute.show(order.id).url
                                            }
                                            className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm font-medium">
                                                        {
                                                            order.formatted_order_number
                                                        }
                                                    </span>
                                                    <Badge
                                                        variant={getStatusBadgeVariant(
                                                            order.status,
                                                        )}
                                                        className="text-xs"
                                                    >
                                                        {order.status_label}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                                    {order.customer_name}
                                                </p>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <p className="text-sm font-semibold">
                                                    {formatCurrency(
                                                        order.total,
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                                <p className="text-sm text-muted-foreground">
                                    Belum ada pesanan
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
