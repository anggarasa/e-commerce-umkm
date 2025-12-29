import {
    index,
    markAllAsRead,
    markAsRead,
} from '@/actions/App/Http/Controllers/Admin/AdminNotificationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import ordersRoute from '@/routes/admin/orders';
import { type AdminNotification } from '@/types';
import { router } from '@inertiajs/react';
import { Bell, CheckCheck, Package, ShoppingCart, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface NotificationDropdownProps {
    className?: string;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Baru saja';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} menit lalu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} jam lalu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} hari lalu`;
    }

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'new_order':
            return <ShoppingCart className="h-4 w-4 text-green-500" />;
        case 'cancellation_request':
            return <XCircle className="h-4 w-4 text-orange-500" />;
        default:
            return <Package className="h-4 w-4 text-blue-500" />;
    }
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(index().url, {
                headers: {
                    Accept: 'application/json',
                },
            });
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(index().url, {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                const data = await response.json();
                setUnreadCount(data.unread_count || 0);
            } catch {
                // Silently fail
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notification: AdminNotification) => {
        if (notification.read_at) return;

        try {
            await fetch(markAsRead(notification.id).url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id
                        ? { ...n, read_at: new Date().toISOString() }
                        : n,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = () => {
        router.post(
            markAllAsRead().url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotifications((prev) =>
                        prev.map((n) => ({
                            ...n,
                            read_at: n.read_at || new Date().toISOString(),
                        })),
                    );
                    setUnreadCount(0);
                },
            },
        );
    };

    const handleNotificationClick = (notification: AdminNotification) => {
        handleMarkAsRead(notification);
        setIsOpen(false);

        // Navigate to relevant page based on notification type
        if (notification.data?.order_id) {
            router.visit(
                ordersRoute.show(notification.data.order_id as string).url,
            );
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`group relative h-9 w-9 cursor-pointer ${className}`}
                >
                    <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="max-h-96 w-80 overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="font-semibold">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>
                <Separator />
                <div className="max-h-72 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-3 p-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                                        !notification.read_at
                                            ? 'bg-primary/5'
                                            : ''
                                    }`}
                                >
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-sm ${
                                                !notification.read_at
                                                    ? 'font-semibold'
                                                    : 'font-medium'
                                            }`}
                                        >
                                            {notification.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                            {notification.message}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground/70">
                                            {formatTimeAgo(
                                                notification.created_at,
                                            )}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="mb-2 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">
                                Belum ada notifikasi
                            </p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
