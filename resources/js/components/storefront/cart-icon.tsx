import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { index as cartIndex } from '@/routes/cart';

interface CartIconProps {
    count?: number;
    className?: string;
}

export function CartIcon({ count = 0, className }: CartIconProps) {
    return (
        <Link href={cartIndex()}>
            <Button
                variant="ghost"
                size="icon"
                className={cn('relative', className)}
            >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
                <span className="sr-only">Keranjang ({count} item)</span>
            </Button>
        </Link>
    );
}
