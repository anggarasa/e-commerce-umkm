import { Link } from '@inertiajs/react';
import { ImageOff, ShoppingBag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { show as showProduct } from '@/routes/products';
import { type Product } from '@/types';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const primaryMedia =
        product.media?.find((m) => m.is_primary) || product.media?.[0];
    const imageUrl = primaryMedia?.thumbnail_url || primaryMedia?.url;
    const isOutOfStock = product.stock <= 0;

    return (
        <Link href={showProduct(product.slug)} className={className}>
            <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageOff className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                    )}

                    {/* Out of stock badge */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <Badge variant="destructive" className="text-sm">
                                Stok Habis
                            </Badge>
                        </div>
                    )}

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                    {/* Category */}
                    {product.category && (
                        <p className="mb-1 text-xs font-medium text-primary">
                            {product.category.name}
                        </p>
                    )}

                    {/* Name */}
                    <h3 className="mb-2 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-lg font-bold text-foreground">
                        {formatCurrency(product.price)}
                    </p>

                    {/* Stock indicator */}
                    {!isOutOfStock && product.stock <= 5 && (
                        <p className="mt-1 text-xs text-orange-500">
                            Tersisa {product.stock} item
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
