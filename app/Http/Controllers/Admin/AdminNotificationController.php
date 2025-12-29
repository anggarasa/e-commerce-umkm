<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AdminNotificationController extends Controller
{
    /**
     * Get all notifications.
     */
    public function index(): JsonResponse
    {
        $notifications = AdminNotification::latest()
            ->take(20)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => AdminNotification::unread()->count(),
        ]);
    }

    /**
     * Get unread notification count.
     */
    public function count(): JsonResponse
    {
        return response()->json([
            'count' => AdminNotification::unread()->count(),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(AdminNotification $notification): JsonResponse
    {
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'unread_count' => AdminNotification::unread()->count(),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        AdminNotification::unread()->update(['read_at' => now()]);

        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }
}
