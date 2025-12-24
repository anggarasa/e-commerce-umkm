import { Link, router } from '@inertiajs/react';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

import { CartItemCard } from '@/components/storefront/cart-item-card';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ConfirmationDialog,
    useConfirmationDialog,
} from '@/components/ui/confirmation-dialog';
import { Separator } from '@/components/ui/separator';
import StorefrontLayout from '@/layouts/storefront-layout';
import { formatCurrency } from '@/lib/utils';
import { clear as clearCart } from '@/routes/cart';
import { create as checkoutCreate } from '@/routes/checkout';
import { index as productsIndex } from '@/routes/products';
import { type Cart } from '@/types';

interface CartIndexProps {
    cart: Cart;
}

export default function CartIndex({ cart }: CartIndexProps) {
    const clearCartDialog = useConfirmationDialog();

    const handleClearCart = () => {
        return new Promise<void>((resolve, reject) => {
            router.delete(clearCart(), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });
    };

    const isEmpty = cart.items.length === 0;

    return (
        <StorefrontLayout title="Keranjang Belanja">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Keranjang Belanja
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {cart.total_items} item dalam keranjang
                        </p>
                    </div>
                    {!isEmpty && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearCartDialog.openDialog}
                            className="gap-2 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            Kosongkan
                        </Button>
                    )}
                </div>

                {isEmpty ? (
                    /* Empty State */
                    <Card className="py-16 text-center">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Keranjang Kosong
                                </h2>
                                <p className="mt-1 text-muted-foreground">
                                    Belum ada produk di keranjang belanja Anda
                                </p>
                            </div>
                            <Link href={productsIndex()}>
                                <Button className="mt-4 gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    /* Cart Content */
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            {cart.items.map((item) => (
                                <CartItemCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Ringkasan Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal ({cart.total_items} item)
                                        </span>
                                        <span>
                                            {formatCurrency(cart.total_price)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Ongkos Kirim
                                        </span>
                                        <span className="text-green-600">
                                            Dihitung saat checkout
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {formatCurrency(cart.total_price)}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3">
                                    <Link
                                        href={checkoutCreate()}
                                        className="w-full"
                                    >
                                        <Button
                                            className="w-full gap-2"
                                            size="lg"
                                        >
                                            <ShoppingBag className="h-5 w-5" />
                                            Checkout
                                        </Button>
                                    </Link>

                                    <Link
                                        href={productsIndex()}
                                        className="w-full"
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full gap-2"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Lanjut Belanja
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Clear Cart Confirmation Dialog */}
            <ConfirmationDialog
                open={clearCartDialog.isOpen}
                onOpenChange={clearCartDialog.setIsOpen}
                variant="destructive"
                title="Kosongkan Keranjang"
                description="Apakah Anda yakin ingin mengosongkan keranjang? Semua produk di keranjang akan dihapus dan tidak dapat dikembalikan."
                confirmText="Ya, Kosongkan"
                cancelText="Batal"
                processingText="Mengosongkan..."
                onConfirm={handleClearCart}
            />
        </StorefrontLayout>
    );
}
