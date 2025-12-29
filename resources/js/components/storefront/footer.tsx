import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';

import AppLogo from '@/components/branding/app-logo';
import { home } from '@/routes';
import { index as productsIndex } from '@/routes/products';
import { SharedData } from '@/types';

export function StorefrontFooter() {
    const currentYear = new Date().getFullYear();
    const { settings } = usePage<SharedData>().props;

    return (
        <footer className="border-t border-border/40 bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href={home()} className="flex items-center gap-2">
                            <AppLogo />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {settings.store_description ||
                                'Platform e-commerce terbaik untuk UMKM Indonesia.'}
                        </p>
                        <div className="flex gap-3">
                            {settings.social_facebook && (
                                <a
                                    href={settings.social_facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {settings.social_instagram && (
                                <a
                                    href={settings.social_instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                            {settings.social_twitter && (
                                <a
                                    href={settings.social_twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Link Cepat</h4>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href={home()}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={productsIndex()}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Semua Produk
                            </Link>
                            <Link
                                href="/about-us"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                href="/privacy-policy"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Kebijakan Privasi
                            </Link>
                            <Link
                                href="/terms-of-service"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Syarat & Ketentuan
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Hubungi Kami</h4>
                        <div className="flex flex-col gap-3">
                            {settings.store_address && (
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{settings.store_address}</span>
                                </div>
                            )}
                            {settings.store_phone && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{settings.store_phone}</span>
                                </div>
                            )}
                            {settings.store_email && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{settings.store_email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">
                            Jam Operasional
                        </h4>
                        <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                            {settings.store_operational_hours ||
                                'Senin - Jumat: 09:00 - 17:00\nSabtu: 09:00 - 15:00\nMinggu: Tutup'}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-border/40 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
                        <p>
                            &copy; {currentYear}{' '}
                            {settings.store_name || 'GarraCommerce'}. All rights
                            reserved.
                        </p>
                        <p>
                            Powered by{' '}
                            <a
                                href="#"
                                className="font-medium text-foreground hover:underline"
                            >
                                {settings.store_name || 'GarraCommerce'}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
