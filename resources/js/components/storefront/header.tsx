import { Link, usePage } from '@inertiajs/react';
import { Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { show as showCategory } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import { type CategoryWithCount, type SharedData } from '@/types';

interface StorefrontHeaderProps {
    categories?: CategoryWithCount[];
}

export function StorefrontHeader({ categories = [] }: StorefrontHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `${productsIndex.url()}?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href={home()} className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold">GarraCommerce</span>
                </Link>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                                )}
                            >
                                <Link href={home()}>Beranda</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                                )}
                            >
                                <Link href={productsIndex()}>Semua Produk</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        {categories.length > 0 && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Kategori
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <NavigationMenuLink
                                                    asChild
                                                    className={cn(
                                                        'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                                    )}
                                                >
                                                    <Link
                                                        href={showCategory(
                                                            category.slug,
                                                        )}
                                                    >
                                                        <div className="text-sm leading-none font-medium">
                                                            {category.name}
                                                        </div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            {
                                                                category.products_count
                                                            }{' '}
                                                            produk
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    {searchOpen ? (
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <Input
                                type="search"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 lg:w-64"
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </form>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Theme toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Admin link (if logged in) */}
                    {auth.user && (
                        <Link href="/admin/dashboard">
                            <Button variant="outline" size="sm">
                                Admin
                            </Button>
                        </Link>
                    )}

                    {/* Mobile menu */}
                    <Sheet>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <nav className="mt-8 flex flex-col gap-4">
                                <Link
                                    href={home()}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href={productsIndex()}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Semua Produk
                                </Link>
                                {categories.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                                            Kategori
                                        </div>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={showCategory(
                                                    category.slug,
                                                )}
                                                className="flex items-center gap-2 rounded-md px-6 py-2 text-sm hover:bg-accent"
                                            >
                                                {category.name}
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {category.products_count}
                                                </span>
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
