import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: Category | null;
    children?: Category[];
}

export interface ProductMedia {
    id: string;
    product_id: string;
    path: string;
    type: 'image' | 'video';
    is_primary: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    media?: ProductMedia[];
}
