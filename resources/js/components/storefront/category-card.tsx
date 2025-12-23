import { Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';

import { Package } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { show as showCategory } from '@/routes/categories';
import { type CategoryWithCount } from '@/types';

interface CategoryCardProps {
    category: CategoryWithCount;
    className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
    // Get icon component dynamically - safely
    const normalizeIconName = (name: string) => {
        return name
            .split(/[-_]+/)
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
            )
            .join('');
    };

    const iconName = category.icon ? normalizeIconName(category.icon) : '';
    const icons = LucideIcons as unknown as Record<
        string,
        LucideIcons.LucideIcon
    >;
    const IconComponent =
        category.icon && icons[iconName] ? icons[iconName] : Package;

    return (
        <Link
            href={showCategory(category.slug)}
            className={cn('block h-full', className)}
        >
            <Card
                className={cn(
                    'group flex h-full flex-col justify-center overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg',
                )}
            >
                <CardContent className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    {/* Icon */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <IconComponent className="h-8 w-8" />
                    </div>

                    {/* Name */}
                    <h3 className="mb-1 font-semibold text-foreground">
                        {category.name}
                    </h3>

                    {/* Product count */}
                    <p className="text-sm text-muted-foreground">
                        {category.products_count} produk
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
