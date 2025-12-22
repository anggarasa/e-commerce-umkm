import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ============================================================================
// Card Variants using CVA
// ============================================================================

const cardVariants = cva(
    // Base styles
    'flex flex-col rounded-2xl border text-card-foreground transition-all duration-300 ease-out',
    {
        variants: {
            variant: {
                default:
                    'bg-card border-border/60 shadow-sm shadow-black/5 dark:border-border/40 dark:shadow-black/10',
                outline:
                    'bg-transparent border-border/80 dark:border-border/60',
                ghost: 'bg-transparent border-transparent shadow-none',
                elevated:
                    'bg-card border-border/40 shadow-lg shadow-black/8 dark:border-border/30 dark:shadow-black/20',
                highlighted:
                    'bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30',
            },
            size: {
                sm: 'gap-3 p-4',
                default: 'gap-6 py-6',
                lg: 'gap-8 p-8',
            },
            interactive: {
                true: 'cursor-pointer hover:shadow-lg hover:shadow-black/8 hover:border-border dark:hover:shadow-black/20 active:scale-[0.99]',
                false: '',
            },
            hoverable: {
                true: 'hover:shadow-lg hover:shadow-black/8 dark:hover:shadow-black/20',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            interactive: false,
            hoverable: true,
        },
    },
);

// ============================================================================
// Card Component Types
// ============================================================================

interface CardProps
    extends React.ComponentProps<'div'>,
        VariantProps<typeof cardVariants> {
    asChild?: boolean;
}

interface CardHeaderProps extends React.ComponentProps<'div'> {
    /** Action element to display on the right side of the header */
    action?: React.ReactNode;
    /** Whether the header has a border bottom */
    bordered?: boolean;
    /** Icon to display before the title */
    icon?: React.ReactNode;
}

interface CardTitleProps extends React.ComponentProps<'div'> {
    /** Render as a different heading level */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
    /** Icon to display before the title */
    icon?: React.ReactNode;
}

type CardDescriptionProps = React.ComponentProps<'div'>;

interface CardContentProps extends React.ComponentProps<'div'> {
    /** Whether to remove horizontal padding */
    noPadding?: boolean;
}

interface CardFooterProps extends React.ComponentProps<'div'> {
    /** Border on top of footer */
    bordered?: boolean;
    /** Alignment of footer content */
    align?: 'start' | 'center' | 'end' | 'between';
}

// ============================================================================
// Card Component
// ============================================================================

function Card({
    className,
    variant,
    size,
    interactive,
    hoverable,
    asChild = false,
    ...props
}: CardProps) {
    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            data-slot="card"
            className={cn(
                cardVariants({ variant, size, interactive, hoverable }),
                className,
            )}
            {...props}
        />
    );
}

// ============================================================================
// CardHeader Component
// ============================================================================

function CardHeader({
    className,
    action,
    bordered,
    icon,
    children,
    ...props
}: CardHeaderProps) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                'flex flex-col gap-2 px-6',
                bordered && 'border-b border-border/50 pb-4 -mt-2',
                action && 'flex-row items-start justify-between',
                className,
            )}
            {...props}
        >
            {icon || action ? (
                <>
                    <div className="flex flex-col gap-2">
                        {icon && (
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                {icon}
                            </div>
                        )}
                        {children}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </>
            ) : (
                children
            )}
        </div>
    );
}

// ============================================================================
// CardTitle Component
// ============================================================================

function CardTitle({
    className,
    as: Component = 'div',
    icon,
    children,
    ...props
}: CardTitleProps) {
    return (
        <Component
            data-slot="card-title"
            className={cn(
                'text-lg font-semibold leading-tight tracking-tight',
                icon && 'flex items-center gap-2',
                className,
            )}
            {...props}
        >
            {icon && (
                <span className="text-muted-foreground [&>svg]:size-5">
                    {icon}
                </span>
            )}
            {children}
        </Component>
    );
}

// ============================================================================
// CardDescription Component
// ============================================================================

function CardDescription({ className, ...props }: CardDescriptionProps) {
    return (
        <div
            data-slot="card-description"
            className={cn(
                'text-muted-foreground text-sm leading-relaxed',
                className,
            )}
            {...props}
        />
    );
}

// ============================================================================
// CardContent Component
// ============================================================================

function CardContent({ className, noPadding, ...props }: CardContentProps) {
    return (
        <div
            data-slot="card-content"
            className={cn(noPadding ? 'px-0' : 'px-6', className)}
            {...props}
        />
    );
}

// ============================================================================
// CardFooter Component
// ============================================================================

const footerAlignments = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
};

function CardFooter({
    className,
    bordered,
    align = 'start',
    ...props
}: CardFooterProps) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                'flex items-center gap-3 px-6 pt-2',
                bordered && 'border-t border-border/50 mt-2 pt-4',
                footerAlignments[align],
                className,
            )}
            {...props}
        />
    );
}

// ============================================================================
// Specialized Card Components for Common Patterns
// ============================================================================

interface StatCardProps extends React.ComponentProps<'div'> {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    description?: string;
}

function StatCard({
    title,
    value,
    icon,
    change,
    changeType = 'neutral',
    description,
    className,
    ...props
}: StatCardProps) {
    const changeColors = {
        positive: 'text-success bg-success/10',
        negative: 'text-destructive bg-destructive/10',
        neutral: 'text-muted-foreground bg-muted',
    };

    return (
        <Card className={cn('group relative overflow-hidden', className)} {...props}>
            {/* Background decoration */}
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

            <CardContent className="relative pt-6">
                <div className="flex items-start justify-between">
                    {icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-6">
                            {icon}
                        </div>
                    )}
                    {change && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                                changeColors[changeType],
                            )}
                        >
                            {change}
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </p>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

interface ActionCardProps extends React.ComponentProps<'button'> {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
}

function ActionCard({
    title,
    description,
    icon,
    className,
    ...props
}: ActionCardProps) {
    return (
        <button
            className={cn(
                'group relative flex flex-col items-start gap-4 rounded-xl border border-border/50 bg-card p-5 text-left transition-all duration-300',
                'hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
                'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                'active:scale-[0.99]',
                className,
            )}
            {...props}
        >
            {icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground [&>svg]:size-5">
                    {icon}
                </div>
            )}
            <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-4 right-4 size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7v10"
                />
            </svg>
        </button>
    );
}

// ============================================================================
// Exports
// ============================================================================

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    StatCard,
    ActionCard,
    cardVariants,
};
export type {
    CardProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardContentProps,
    CardFooterProps,
    StatCardProps,
    ActionCardProps,
};
