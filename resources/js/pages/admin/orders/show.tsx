import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import {
    approveCancellation,
    index,
    rejectCancellation,
    show as showRoute,
    update,
} from '@/routes/admin/orders';
import { type BreadcrumbItem, type Order, type OrderStatuses } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    Check,
    ChevronLeft,
    ClipboardList,
    Mail,
    MapPin,
    Package,
    Phone,
    User,
    X,
} from 'lucide-react';

interface Props {
    order: Order;
    statuses: OrderStatuses;
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

export default function OrdersShow({ order, statuses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pesanan',
            href: '/admin/orders',
        },
        {
            title: `#${order.order_number}`,
            href: showRoute.url(order.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        admin_notes: order.admin_notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(order.id));
    };

    const handleApproveCancellation = () => {
        router.post(approveCancellation.url(order.id));
    };

    const handleRejectCancellation = () => {
        router.post(rejectCancellation.url(order.id));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pesanan ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={index.url()}>
                                <ChevronLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    #{order.order_number}
                                </h1>
                                <Badge
                                    className={`${statusColors[order.status] || ''}`}
                                >
                                    {statuses[order.status] || order.status}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Detail dan kelola pesanan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Order Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="size-5" />
                                    Informasi Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <User className="size-5 text-muted-foreground" />
                                    </div>
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
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Phone className="size-5 text-muted-foreground" />
                                    </div>
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
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <Mail className="size-5 text-muted-foreground" />
                                        </div>
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
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <MapPin className="size-5 text-muted-foreground" />
                                    </div>
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

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="size-5" />
                                    Item Pesanan
                                </CardTitle>
                                <CardDescription>
                                    {order.items?.length || 0} produk dalam
                                    pesanan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4"
                                        >
                                            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                                {item.product?.media?.[0] ? (
                                                    <img
                                                        src={`/storage/${item.product.media[0].path}`}
                                                        alt={item.product_name}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="size-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-center">
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
                                            <div className="flex items-center">
                                                <p className="font-medium">
                                                    {formatCurrency(
                                                        Number(item.subtotal),
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <Separator />

                                    {/* Order Summary */}
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="size-5" />
                                        Catatan Pelanggan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {order.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cancellation Request */}
                        {order.cancellation_requested &&
                            order.status !== 'cancelled' && (
                                <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                            <AlertTriangle className="size-5" />
                                            Permintaan Pembatalan
                                        </CardTitle>
                                        <CardDescription className="text-orange-600 dark:text-orange-500">
                                            Pelanggan mengajukan pembatalan
                                            pesanan ini
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {order.cancellation_reason && (
                                            <div>
                                                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                                                    Alasan Pembatalan:
                                                </p>
                                                <p className="mt-1 text-orange-800 dark:text-orange-300">
                                                    {order.cancellation_reason}
                                                </p>
                                            </div>
                                        )}
                                        {order.cancellation_requested_at && (
                                            <p className="text-sm text-orange-600 dark:text-orange-500">
                                                Diajukan pada:{' '}
                                                {formatDate(
                                                    order.cancellation_requested_at,
                                                )}
                                            </p>
                                        )}
                                        <div className="flex gap-3 pt-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="gap-2"
                                                    >
                                                        <Check className="size-4" />
                                                        Setujui Pembatalan
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Setujui Pembatalan
                                                            Pesanan?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Pesanan akan diubah
                                                            statusnya menjadi
                                                            "Dibatalkan".
                                                            Tindakan ini tidak
                                                            dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Batal
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleApproveCancellation
                                                            }
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Ya, Setujui
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="gap-2"
                                                    >
                                                        <X className="size-4" />
                                                        Tolak Pembatalan
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Tolak Pembatalan
                                                            Pesanan?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Permintaan
                                                            pembatalan akan
                                                            dihapus dan pesanan
                                                            akan dilanjutkan
                                                            dengan status saat
                                                            ini.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Batal
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleRejectCancellation
                                                            }
                                                        >
                                                            Ya, Tolak
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Update Status Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                                <CardDescription>
                                    Ubah status pesanan dan tambah catatan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            name="status"
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData(
                                                    'status',
                                                    value as Order['status'],
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(statuses).map(
                                                    ([key, label]) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-destructive">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="admin_notes">
                                            Catatan Admin
                                        </Label>
                                        <Textarea
                                            id="admin_notes"
                                            name="admin_notes"
                                            placeholder="Catatan internal (tidak terlihat oleh pelanggan)"
                                            value={data.admin_notes}
                                            onChange={(e) =>
                                                setData(
                                                    'admin_notes',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                        />
                                        {errors.admin_notes && (
                                            <p className="text-sm text-destructive">
                                                {errors.admin_notes}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="size-5" />
                                    Informasi Waktu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Dibuat pada
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(order.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Diperbarui pada
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(order.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Notes Display */}
                        {order.admin_notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Catatan Admin</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                        {order.admin_notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
