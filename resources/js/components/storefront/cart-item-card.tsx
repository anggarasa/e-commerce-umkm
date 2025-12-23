import { router } from '@inertiajs/react';
import { ImageOff, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    // Track the pending quantity (what user selected but not yet synced)
    const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Display quantity: use pending if exists and syncing, otherwise use server value
    const displayQuantity = pendingQuantity ?? item.quantity;

    const primaryMedia =
        item.product.media?.find((m) => m.is_primary) ||
        item.product.media?.[0];

    // Debounced sync to server
    const syncToServer = useCallback(
        (newQuantity: number) => {
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Set syncing state
            setIsSyncing(true);

            // Debounce for 500ms
            debounceTimerRef.current = setTimeout(() => {
                router.patch(
                    updateCartItem(item.id),
                    { quantity: newQuantity },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            // Clear pending since server now has the correct value
                            setPendingQuantity(null);
                            setIsSyncing(false);
                        },
                        onError: () => {
                            // Clear pending to revert to server value
                            setPendingQuantity(null);
                            setIsSyncing(false);
                        },
                    },
                );
            }, 500);
        },
        [item.id],
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.product.stock) return;

        // Skip if same as current server value and no pending changes
        if (newQuantity === item.quantity && pendingQuantity === null) return;

        // Update pending state immediately (optimistic update)
        setPendingQuantity(newQuantity);
        // Schedule sync to server
        syncToServer(newQuantity);
    };

    const handleRemove = () => {
        router.delete(removeCartItem(item.id), {
            preserveScroll: true,
        });
    };

    const isOutOfStock = item.product.stock <= 0;
    const isLowStock =
        item.product.stock > 0 && item.product.stock < displayQuantity;

    // Calculate subtotal based on display quantity
    const displaySubtotal = item.price * displayQuantity;

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
                                        handleQuantityChange(
                                            displayQuantity - 1,
                                        )
                                    }
                                    disabled={displayQuantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    min={1}
                                    max={item.product.stock}
                                    value={displayQuantity}
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
                                        handleQuantityChange(
                                            displayQuantity + 1,
                                        )
                                    }
                                    disabled={
                                        displayQuantity >= item.product.stock
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Subtotal & Remove */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-primary">
                                        {formatCurrency(displaySubtotal)}
                                    </span>
                                    {isSyncing && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
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
