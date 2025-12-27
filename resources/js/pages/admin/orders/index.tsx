import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ColumnDef, DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { index as indexRoute, show as showRoute } from '@/routes/admin/orders';
import { type BreadcrumbItem, type Order, type OrderStatuses } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Eye, Package, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    statuses: OrderStatuses;
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
        limit?: number;
        cancellation_request?: string;
    };
    cancellationRequestsCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/admin/orders',
    },
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

export default function OrdersIndex({
    orders,
    statuses,
    filters,
    cancellationRequestsCount,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [showCancellationRequests, setShowCancellationRequests] = useState(
        filters.cancellation_request === 'true',
    );

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.visit(indexRoute.url(), {
                    data: {
                        ...filters,
                        search: search || null,
                        page: 1,
                    },
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                status: value === 'all' ? null : value,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setShowCancellationRequests(false);
        router.visit(indexRoute.url(), {
            data: {
                limit: filters.limit,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleCancellationRequests = () => {
        const newValue = !showCancellationRequests;
        setShowCancellationRequests(newValue);
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                cancellation_request: newValue ? 'true' : null,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                page,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePerPageChange = (limit: number) => {
        router.visit(indexRoute.url(), {
            data: {
                ...filters,
                page: 1,
                limit,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Define columns for the DataTable
    const columns: ColumnDef<Order>[] = [
        {
            id: 'order_number',
            header: 'No. Pesanan',
            cell: (order) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={showRoute.url(order.id)}
                        className="font-medium text-primary hover:underline"
                    >
                        #{order.order_number}
                    </Link>
                    {order.cancellation_requested &&
                        order.status !== 'cancelled' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                <AlertTriangle className="size-3" />
                                Batal
                            </span>
                        )}
                </div>
            ),
        },
        {
            id: 'customer',
            header: 'Pelanggan',
            cell: (order) => (
                <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">
                        {order.customer_phone}
                    </div>
                </div>
            ),
        },
        {
            id: 'items',
            header: 'Item',
            cell: (order) => (
                <span className="text-muted-foreground">
                    {order.items?.length || 0} produk
                </span>
            ),
        },
        {
            id: 'total',
            header: 'Total',
            cell: (order) => (
                <span className="font-medium">
                    {formatCurrency(Number(order.total))}
                </span>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            cell: (order) => (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || ''}`}
                >
                    {statuses[order.status] || order.status}
                </span>
            ),
        },
        {
            id: 'date',
            header: 'Tanggal',
            cell: (order) => (
                <span className="text-muted-foreground">
                    {formatDate(order.created_at)}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            cell: (order) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={showRoute.url(order.id)}>
                        <Eye className="size-4" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesanan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Manajemen Pesanan
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola dan pantau status pesanan pelanggan
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Pesanan</CardTitle>
                        <CardDescription>
                            Cari dan filter pesanan berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari no. pesanan, nama, atau telepon..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    {Object.entries(statuses).map(
                                        ([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            <Button
                                variant={
                                    showCancellationRequests
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={toggleCancellationRequests}
                                className="relative gap-2"
                            >
                                <AlertTriangle className="size-4" />
                                <span className="hidden sm:inline">
                                    Permintaan Batal
                                </span>
                                {cancellationRequestsCount > 0 && (
                                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                        {cancellationRequestsCount}
                                    </span>
                                )}
                            </Button>
                            {(search ||
                                status !== 'all' ||
                                showCancellationRequests) && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="px-2 lg:px-3"
                                >
                                    Reset
                                    <X className="ml-2 size-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pesanan</CardTitle>
                        <CardDescription>
                            Total {orders.total} pesanan ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DataTable
                            columns={columns}
                            data={orders.data}
                            getRowKey={(order) => order.id}
                            emptyState={{
                                icon: (
                                    <Package className="mb-2 size-12 text-muted-foreground/40" />
                                ),
                                title: 'Belum ada pesanan',
                                description:
                                    'Pesanan baru akan muncul di sini setelah pelanggan melakukan checkout',
                            }}
                        />

                        <Pagination
                            meta={orders}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
