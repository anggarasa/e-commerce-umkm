import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import StorefrontLayout from '@/layouts/storefront-layout';
import { formatCurrency } from '@/lib/utils';
import { my as myOrders, show as showOrder } from '@/routes/orders';
import { type Order, type OrderStatuses } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    Package,
    Search,
    ShoppingBag,
} from 'lucide-react';

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    statuses: OrderStatuses;
    filters: {
        status?: string;
    };
}

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

export default function MyOrders({ orders, statuses, filters }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleStatusFilter = (value: string) => {
        router.get(
            myOrders.url(),
            { status: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <StorefrontLayout title="Pesanan Saya">
            <Head title="Pesanan Saya" />
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Pesanan Saya
                            </h1>
                            <p className="text-muted-foreground">
                                Lihat dan lacak semua pesanan Anda
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={handleStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
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
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length > 0 ? (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Card
                                    key={order.id}
                                    className="overflow-hidden"
                                >
                                    <CardHeader className="bg-muted/30 pb-3">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Package className="size-5 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">
                                                        #{order.order_number}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {formatDate(
                                                            order.created_at,
                                                        )}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`${statusColors[order.status] || ''}`}
                                            >
                                                {statuses[order.status] ||
                                                    order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {order.items?.length || 0}{' '}
                                                    produk
                                                </p>
                                                <p className="font-semibold">
                                                    {formatCurrency(
                                                        Number(order.total),
                                                    )}
                                                </p>
                                            </div>
                                            <Button asChild>
                                                <Link
                                                    href={showOrder.url(
                                                        order.order_number,
                                                    )}
                                                >
                                                    Lihat Detail
                                                    <ChevronRight className="ml-1 size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex justify-center gap-2 pt-4">
                                    {Array.from(
                                        { length: orders.last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <Button
                                            key={page}
                                            variant={
                                                page === orders.current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    myOrders.url({
                                                        query: {
                                                            page,
                                                            status: filters.status,
                                                        },
                                                    }),
                                                )
                                            }
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty State */
                        <Card className="py-12">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                                    <ShoppingBag className="size-8 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Belum ada pesanan
                                </h3>
                                <p className="mb-6 max-w-sm text-muted-foreground">
                                    Anda belum memiliki pesanan. Mulai belanja
                                    sekarang dan temukan produk favorit Anda!
                                </p>
                                <Button asChild>
                                    <Link href="/products">Mulai Belanja</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Track Order Link */}
                    <Card className="mt-6">
                        <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Search className="size-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Lacak Pesanan Lainnya
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Cari pesanan dengan nomor order
                                    </p>
                                </div>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/orders/track">Lacak Pesanan</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </StorefrontLayout>
    );
}
