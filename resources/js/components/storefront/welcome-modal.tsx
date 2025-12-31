import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Code2,
    ExternalLink,
    Rocket,
    ShoppingCart,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface DemoFeature {
    icon: React.ReactNode;
    text: string;
}

const demoFeatures: DemoFeature[] = [
    {
        icon: <ShoppingCart className="h-4 w-4" />,
        text: 'Fitur E-commerce Lengkap',
    },
    {
        icon: <Rocket className="h-4 w-4" />,
        text: 'Siap Deploy ke Production',
    },
    {
        icon: <Code2 className="h-4 w-4" />,
        text: 'Source Code Premium',
    },
    {
        icon: <CheckCircle2 className="h-4 w-4" />,
        text: 'Full Support & Dokumentasi',
    },
];

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal every time user visits the website
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-background via-background to-amber-500/5 shadow-2xl shadow-amber-500/10">
                            {/* Decorative elements */}
                            <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

                            {/* Header banner */}
                            <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-white">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-sm font-semibold">
                                            Pemberitahuan Demo
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                                        aria-label="Tutup"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative p-4">
                                {/* Logo and title */}
                                <div className="mb-3 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: 'spring',
                                            delay: 0.2,
                                        }}
                                        className="mb-2 inline-flex items-center justify-center"
                                    >
                                        <div className="relative">
                                            <img
                                                src="/assets/logo/logo.png"
                                                alt="GarraCommerce Logo"
                                                className="h-10 w-auto"
                                            />
                                            <motion.div
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    scale: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                                className="absolute -top-1 -right-1"
                                            >
                                                <Sparkles className="h-4 w-4 text-amber-500" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h2 className="mb-1 text-lg font-bold tracking-tight text-foreground">
                                            Ini Adalah Website Demo
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Anda sedang melihat{' '}
                                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                                preview/demo
                                            </span>{' '}
                                            dari project{' '}
                                            <strong>GarraCommerce</strong> —
                                            Platform E-commerce modern untuk
                                            UMKM.
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Info box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mb-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30"
                                >
                                    <p className="text-center text-sm text-amber-800 dark:text-amber-200">
                                        <strong>Perhatian:</strong> Website ini
                                        hanya untuk{' '}
                                        <em>review dan demonstrasi</em>. Semua
                                        data yang ditampilkan adalah contoh dan
                                        tidak dapat digunakan untuk transaksi
                                        nyata.
                                    </p>
                                </motion.div>

                                {/* Features list */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-3"
                                >
                                    <p className="mb-2 text-center text-xs font-medium text-foreground">
                                        Yang Anda Dapatkan Jika Membeli:
                                    </p>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {demoFeatures.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.6 + index * 0.1,
                                                }}
                                                className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5"
                                            >
                                                <span className="text-primary">
                                                    {feature.icon}
                                                </span>
                                                <span className="text-[11px] font-medium text-foreground">
                                                    {feature.text}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="flex flex-col gap-2"
                                >
                                    <Button
                                        size="default"
                                        onClick={handleClose}
                                        className="w-full gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/25"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Saya Mengerti, Lanjutkan Demo
                                    </Button>
                                    <a
                                        href="https://github.com/anggarasa/e-commerce-umkm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Lihat Repository GitHub
                                    </a>
                                </motion.div>

                                {/* Footer note */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-3 text-center text-[10px] text-muted-foreground"
                                >
                                    Tertarik membeli project ini? Hubungi
                                    developer untuk informasi lebih lanjut.
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
