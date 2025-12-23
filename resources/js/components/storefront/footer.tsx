import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
    Twitter,
} from 'lucide-react';

import { home } from '@/routes';
import { index as productsIndex } from '@/routes/products';

export function StorefrontFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href={home()} className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold">
                                GarraCommerce
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Platform e-commerce terbaik untuk UMKM Indonesia.
                            Mulai berjualan online dengan mudah dan cepat.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
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
                            <a
                                href="#"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Tentang Kami
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Kebijakan Privasi
                            </a>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Hubungi Kami</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>Jl. Contoh No. 123, Kota, Indonesia</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>+62 812 3456 7890</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>info@garracommerce.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">
                            Jam Operasional
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Senin - Jumat</span>
                                <span>08:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sabtu</span>
                                <span>09:00 - 15:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Minggu</span>
                                <span>Tutup</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-border/40 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
                        <p>
                            &copy; {currentYear} GarraCommerce. All rights
                            reserved.
                        </p>
                        <p>
                            Powered by{' '}
                            <a
                                href="#"
                                className="font-medium text-foreground hover:underline"
                            >
                                GarraCommerce Platform
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
