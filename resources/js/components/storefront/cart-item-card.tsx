import { router } from '@inertiajs/react';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import {
    remove as removeCartItem,
    update as updateCartItem,
} from '@/routes/cart';
import { type CartItem } from '@/types';

interface CartItemCardProps {
    item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
    const primaryMedia =
        item.product.media?.find((m) => m.is_primary) ||
        item.product.media?.[0];

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.product.stock) return;

        router.patch(
            updateCartItem(item.id),
            { quantity: newQuantity },
            { preserveScroll: true },
        );
    };

    const handleRemove = () => {
        router.delete(removeCartItem(item.id), {
            preserveScroll: true,
        });
    };

    const isOutOfStock = item.product.stock <= 0;
    const isLowStock =
        item.product.stock > 0 && item.product.stock < item.quantity;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {primaryMedia ? (
                            <img
                                src={
                                    primaryMedia.thumbnail_url ||
                                    primaryMedia.url
                                }
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageOff className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                        )}
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                <span className="text-xs font-medium text-destructive">
                                    Habis
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <h3 className="line-clamp-2 font-medium">
                                {item.product.name}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {formatCurrency(item.price)} / item
                            </p>
                            {isLowStock && (
                                <p className="mt-1 text-xs text-orange-500">
                                    Stok tersisa: {item.product.stock}
                                </p>
                            )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        handleQuantityChange(item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    min={1}
                                    max={item.product.stock}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    className="h-8 w-16 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        handleQuantityChange(item.quantity + 1)
                                    }
                                    disabled={
                                        item.quantity >= item.product.stock
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Subtotal & Remove */}
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-primary">
                                    {formatCurrency(item.subtotal)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={handleRemove}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
