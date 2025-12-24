import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import StorefrontLayout from '@/layouts/storefront-layout';
import { formatCurrency } from '@/lib/utils';
import { index as cartIndex } from '@/routes/cart';
import { store as checkoutStore } from '@/routes/checkout';
import { show as productShow } from '@/routes/products';
import { type Cart, type Product, type ProductMedia } from '@/types';

interface DirectProduct {
    product: Product & { media?: ProductMedia[] };
    quantity: number;
    price: number;
    subtotal: number;
}

interface CheckoutFormData {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_address: string;
    notes: string;
    product_id?: string;
    quantity?: number;
}

interface CheckoutProps {
    cart: Cart | null;
    directProduct: DirectProduct | null;
    shippingCost: number;
}

export default function CheckoutIndex({
    cart,
    directProduct,
    shippingCost,
}: CheckoutProps) {
    const isDirectCheckout = directProduct !== null;

    const { data, setData, errors, processing, post } =
        useForm<CheckoutFormData>({
            customer_name: '',
            customer_phone: '',
            customer_email: '',
            customer_address: '',
            notes: '',
            ...(isDirectCheckout && {
                product_id: directProduct.product.id,
                quantity: directProduct.quantity,
            }),
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(checkoutStore.url());
    };

    // Calculate totals
    const totalItems = isDirectCheckout
        ? directProduct.quantity
        : (cart?.total_items ?? 0);
    const totalPrice = isDirectCheckout
        ? directProduct.subtotal
        : (cart?.total_price ?? 0);

    // Get items to display
    const items = isDirectCheckout
        ? [
              {
                  id: directProduct.product.id,
                  product: directProduct.product,
                  quantity: directProduct.quantity,
                  price: directProduct.price,
                  subtotal: directProduct.subtotal,
              },
          ]
        : (cart?.items ?? []);

    // Back link
    const backHref = isDirectCheckout
        ? productShow(directProduct.product.slug)
        : cartIndex();
    const backText = isDirectCheckout
        ? 'Kembali ke Produk'
        : 'Kembali ke Keranjang';

    return (
        <StorefrontLayout title="Checkout">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={backHref}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        {backText}
                    </Link>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                    <p className="mt-1 text-muted-foreground">
                        Lengkapi data pengiriman untuk memproses pesanan
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Checkout Form */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="size-5" />
                                        Informasi Pengiriman
                                    </CardTitle>
                                    <CardDescription>
                                        Masukkan data penerima pesanan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="customer_name">
                                                Nama Lengkap{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="customer_name"
                                                name="customer_name"
                                                placeholder="Masukkan nama lengkap"
                                                value={data.customer_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'customer_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.customer_name
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {errors.customer_name && (
                                                <p className="text-sm text-destructive">
                                                    {errors.customer_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customer_phone">
                                                Nomor Telepon{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="customer_phone"
                                                name="customer_phone"
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                                value={data.customer_phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'customer_phone',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.customer_phone
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {errors.customer_phone && (
                                                <p className="text-sm text-destructive">
                                                    {errors.customer_phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer_email">
                                            Email{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="customer_email"
                                            name="customer_email"
                                            type="email"
                                            placeholder="email@contoh.com"
                                            value={data.customer_email}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_email',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.customer_email
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        />
                                        {errors.customer_email && (
                                            <p className="text-sm text-destructive">
                                                {errors.customer_email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer_address">
                                            Alamat Lengkap{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="customer_address"
                                            name="customer_address"
                                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                                            rows={3}
                                            value={data.customer_address}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_address',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.customer_address
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        />
                                        {errors.customer_address && (
                                            <p className="text-sm text-destructive">
                                                {errors.customer_address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">
                                            Catatan (opsional)
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            name="notes"
                                            placeholder="Catatan tambahan untuk pesanan..."
                                            rows={2}
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                        />
                                        {errors.notes && (
                                            <p className="text-sm text-destructive">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="size-5" />
                                        Ringkasan Pesanan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Items */}
                                    <div className="max-h-60 space-y-3 overflow-y-auto">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-3"
                                            >
                                                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                    {item.product.media?.[0] ? (
                                                        <img
                                                            src={
                                                                item.product
                                                                    .media[0]
                                                                    .url ||
                                                                `/storage/${item.product.media[0].path}`
                                                            }
                                                            alt={
                                                                item.product
                                                                    .name
                                                            }
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="size-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col text-sm">
                                                    <span className="truncate font-medium">
                                                        {item.product.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {item.quantity} x{' '}
                                                        {formatCurrency(
                                                            item.price,
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="shrink-0 text-sm font-medium">
                                                    {formatCurrency(
                                                        item.subtotal,
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Subtotal ({totalItems} item)
                                            </span>
                                            <span>
                                                {formatCurrency(totalPrice)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Ongkos Kirim
                                            </span>
                                            <span>
                                                {shippingCost > 0 ? (
                                                    formatCurrency(shippingCost)
                                                ) : (
                                                    <span className="text-green-600">
                                                        Gratis
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">
                                                {formatCurrency(
                                                    totalPrice + shippingCost,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : 'Buat Pesanan'}
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground">
                                        Dengan memesan, Anda menyetujui syarat
                                        dan ketentuan yang berlaku
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </StorefrontLayout>
    );
}
