import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StorefrontLayout from '@/layouts/storefront-layout';
import { formatCurrency } from '@/lib/utils';
import { type Order, type OrderStatuses } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
    XCircle,
} from 'lucide-react';

interface Props {
    order: Order;
    statuses: OrderStatuses;
    isOwner: boolean;
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

// Status timeline configuration
const statusSteps = [
    {
        key: 'pending',
        label: 'Menunggu Konfirmasi',
        icon: Clock,
        description: 'Pesanan diterima',
    },
    {
        key: 'processing',
        label: 'Diproses',
        icon: Package,
        description: 'Pesanan sedang diproses',
    },
    {
        key: 'shipped',
        label: 'Dikirim',
        icon: Truck,
        description: 'Pesanan dalam pengiriman',
    },
    {
        key: 'delivered',
        label: 'Diterima',
        icon: CheckCircle2,
        description: 'Pesanan telah sampai',
    },
];

export default function OrderShow({ order, statuses, isOwner }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get current step index
    const getCurrentStepIndex = () => {
        if (order.status === 'cancelled') return -1;
        return statusSteps.findIndex((step) => step.key === order.status);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <StorefrontLayout title={`Pesanan #${order.order_number}`}>
            <Head title={`Pesanan #${order.order_number}`} />
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button asChild variant="ghost" className="gap-2 pl-0">
                            <Link
                                href={isOwner ? '/my-orders' : '/orders/track'}
                            >
                                <ArrowLeft className="size-4" />
                                {isOwner
                                    ? 'Kembali ke Pesanan Saya'
                                    : 'Lacak Pesanan Lain'}
                            </Link>
                        </Button>
                    </div>

                    {/* Header */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Package className="size-5" />#{' '}
                                        {order.order_number}
                                    </CardTitle>
                                    <CardDescription className="mt-1 flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {formatDate(order.created_at)}
                                    </CardDescription>
                                </div>
                                <Badge
                                    className={`self-start text-sm ${statusColors[order.status] || ''}`}
                                >
                                    {statuses[order.status] || order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Status Timeline */}
                    {order.status !== 'cancelled' ? (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Status Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-0 left-[19px] h-full w-0.5 bg-muted" />
                                    <div
                                        className="absolute top-0 left-[19px] w-0.5 bg-primary transition-all duration-500"
                                        style={{
                                            height: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`,
                                        }}
                                    />

                                    {/* Steps */}
                                    <div className="space-y-6">
                                        {statusSteps.map((step, index) => {
                                            const isCompleted =
                                                index <= currentStepIndex;
                                            const isCurrent =
                                                index === currentStepIndex;
                                            const Icon = step.icon;

                                            return (
                                                <div
                                                    key={step.key}
                                                    className="relative flex items-start gap-4"
                                                >
                                                    <div
                                                        className={`z-10 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                                                            isCompleted
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                                                    >
                                                        <Icon className="size-5" />
                                                    </div>
                                                    <div className="pt-1">
                                                        <p
                                                            className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
                                                        >
                                                            {step.label}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                                    <XCircle className="size-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-800 dark:text-red-400">
                                        Pesanan Dibatalkan
                                    </p>
                                    <p className="text-sm text-red-600 dark:text-red-500">
                                        Pesanan ini telah dibatalkan. Silakan
                                        hubungi kami jika ada pertanyaan.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="size-5" />
                                    Informasi Pengiriman
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Nama
                                        </p>
                                        <p className="font-medium">
                                            {order.customer_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Telepon
                                        </p>
                                        <p className="font-medium">
                                            {order.customer_phone}
                                        </p>
                                    </div>
                                </div>
                                {order.customer_email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {order.customer_email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Alamat
                                        </p>
                                        <p className="font-medium">
                                            {order.customer_address}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="size-5" />
                                    Ringkasan Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                                    {item.product
                                                        ?.media?.[0] ? (
                                                        <img
                                                            src={`/storage/${item.product.media[0].path}`}
                                                            alt={
                                                                item.product_name
                                                            }
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="size-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.quantity} x{' '}
                                                        {formatCurrency(
                                                            Number(
                                                                item.product_price,
                                                            ),
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-medium">
                                                {formatCurrency(
                                                    Number(item.subtotal),
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                Number(order.subtotal),
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Ongkos Kirim
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                Number(order.shipping_cost),
                                            )}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {formatCurrency(
                                                Number(order.total),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Catatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {order.notes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
