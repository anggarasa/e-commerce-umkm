import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

import { StorefrontFooter } from '@/components/storefront/footer';
import { StorefrontHeader } from '@/components/storefront/header';
import { type CategoryWithCount } from '@/types';

interface StorefrontLayoutProps {
    children: ReactNode;
    title?: string;
    categories?: CategoryWithCount[];
}

export default function StorefrontLayout({
    children,
    title,
    categories = [],
}: StorefrontLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col bg-background">
                <StorefrontHeader categories={categories} />
                <main className="flex-1">{children}</main>
                <StorefrontFooter />
            </div>
        </>
    );
}
