import AppLogoIcon from '@/components/branding/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 p-6 md:p-10">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Gradient orbs for visual interest */}
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[400px]">
                {/* Card container with glassmorphism effect */}
                <div className="animate-fade-in rounded-2xl border border-border/40 bg-card/95 p-8 shadow-xl shadow-black/5 backdrop-blur-sm dark:border-border/30 dark:bg-card/90 dark:shadow-black/20">
                    <div className="flex flex-col gap-8">
                        {/* Logo and branding */}
                        <div className="flex flex-col items-center gap-6">
                            <Link
                                href={home()}
                                className="group flex flex-col items-center gap-3 font-medium outline-none"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15 group-focus:ring-2 group-focus:ring-ring group-focus:ring-offset-2">
                                    <AppLogoIcon className="size-8 fill-current text-primary" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            {/* Title and description */}
                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {title}
                                </h1>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Form content */}
                        <div className="w-full">{children}</div>
                    </div>
                </div>

                {/* Footer text */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Protected by enterprise-grade security
                </p>
            </div>
        </div>
    );
}
