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
    settings: Record<string, string>;
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
    thumbnail_path: string | null;
    url: string;
    thumbnail_url: string | null;
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

export interface ProductFilters {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?:
        | 'newest'
        | 'oldest'
        | 'price_asc'
        | 'price_desc'
        | 'name_asc'
        | 'name_desc';
}

export interface CategoryWithCount extends Category {
    products_count: number;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
    created_at: string;
    updated_at: string;
}

export interface Cart {
    id: string;
    user_id: string | null;
    session_id: string | null;
    items: CartItem[];
    total_items: number;
    total_price: number;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    user_id: string | null;
    order_number: string;
    formatted_order_number: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    customer_address: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    status_label: string;
    notes: string | null;
    admin_notes: string | null;
    items: OrderItem[];
    user?: User | null;
    created_at: string;
    updated_at: string;
}

export type OrderStatuses = Record<string, string>;
