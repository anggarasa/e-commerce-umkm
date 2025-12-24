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
import StorefrontLayout from '@/layouts/storefront-layout';
import { submit } from '@/routes/orders/track';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, Package, Search, ShoppingBag } from 'lucide-react';

export default function TrackOrder() {
    const { data, setData, post, processing, errors } = useForm({
        order_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submit.url());
    };

    return (
        <StorefrontLayout title="Lacak Pesanan">
            <Head title="Lacak Pesanan" />
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                            <Search className="size-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Lacak Pesanan
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Masukkan nomor pesanan untuk melihat status dan
                            detail pesanan Anda
                        </p>
                    </div>

                    {/* Track Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="size-5" />
                                Cari Pesanan
                            </CardTitle>
                            <CardDescription>
                                Nomor pesanan dapat ditemukan di email
                                konfirmasi atau halaman sukses checkout
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order_number">
                                        Nomor Pesanan
                                    </Label>
                                    <Input
                                        id="order_number"
                                        type="text"
                                        placeholder="Contoh: ORD20241224ABCD"
                                        value={data.order_number}
                                        onChange={(e) =>
                                            setData(
                                                'order_number',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.order_number
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.order_number && (
                                        <p className="text-sm text-destructive">
                                            {errors.order_number}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={
                                        processing || !data.order_number.trim()
                                    }
                                >
                                    {processing ? (
                                        'Mencari...'
                                    ) : (
                                        <>
                                            <Search className="size-4" />
                                            Cari Pesanan
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Options */}
                    <div className="mt-6 space-y-4">
                        <Card>
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <LogIn className="size-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Punya Akun?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Login untuk melihat semua pesanan Anda
                                    </p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/login">Login</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <ShoppingBag className="size-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Belanja Lagi?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Temukan produk terbaru kami
                                    </p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/products">Belanja</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
