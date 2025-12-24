import { Link } from '@inertiajs/react';
import {
    CheckCircle,
    ExternalLink,
    Home,
    Package,
    ShoppingBag,
} from 'lucide-react';

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
import { index as productsIndex } from '@/routes/products';
import { type Order } from '@/types';

interface CheckoutSuccessProps {
    order: Order;
    whatsapp_url: string | null;
}

export default function CheckoutSuccess({
    order,
    whatsapp_url,
}: CheckoutSuccessProps) {
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
        <StorefrontLayout title="Pesanan Berhasil">
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-2xl">
                    {/* Success Message */}
                    <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                                    <CheckCircle className="size-10 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
                                    Pesanan Berhasil Dibuat!
                                </h1>
                                <p className="mt-2 text-green-700 dark:text-green-500">
                                    Terima kasih atas pesanan Anda. Kami akan
                                    segera memproses pesanan Anda.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Button */}
                    {whatsapp_url && (
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <p className="text-muted-foreground">
                                        Konfirmasi pesanan Anda via WhatsApp
                                        untuk mempercepat proses
                                    </p>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        <a
                                            href={whatsapp_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="size-5" />
                                            Konfirmasi via WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Details */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Detail Pesanan</CardTitle>
                                    <CardDescription>
                                        No. Pesanan: #{order.order_number}
                                    </CardDescription>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(order.created_at)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Customer Info */}
                            <div className="rounded-lg bg-muted/50 p-4">
                                <h3 className="mb-2 font-semibold">
                                    Informasi Pengiriman
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p>
                                        <span className="text-muted-foreground">
                                            Nama:
                                        </span>{' '}
                                        {order.customer_name}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">
                                            Telepon:
                                        </span>{' '}
                                        {order.customer_phone}
                                    </p>
                                    {order.customer_email && (
                                        <p>
                                            <span className="text-muted-foreground">
                                                Email:
                                            </span>{' '}
                                            {order.customer_email}
                                        </p>
                                    )}
                                    <p>
                                        <span className="text-muted-foreground">
                                            Alamat:
                                        </span>{' '}
                                        {order.customer_address}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="mb-3 font-semibold">
                                    Item Pesanan
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 items-center justify-center rounded bg-muted">
                                                    <Package className="size-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
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
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    Number(item.subtotal),
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>
                                        {formatCurrency(Number(order.subtotal))}
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
                                        {formatCurrency(Number(order.total))}
                                    </span>
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="rounded-lg border border-dashed p-4">
                                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                                        Catatan
                                    </h4>
                                    <p className="text-sm">{order.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/">
                                <Home className="size-4" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" className="gap-2">
                            <Link href={`/orders/${order.order_number}`}>
                                <Package className="size-4" />
                                Lihat Detail Pesanan
                            </Link>
                        </Button>
                        <Button asChild className="gap-2">
                            <Link href={productsIndex()}>
                                <ShoppingBag className="size-4" />
                                Lanjut Belanja
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
