<?php

namespace App\Services;

use App\Mail\AdminNotificationMail;
use App\Models\AdminNotification;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;

class AdminNotificationService
{
    /**
     * Create notification for a new order.
     */
    public function notifyNewOrder(Order $order): AdminNotification
    {
        $notification = AdminNotification::create([
            'type' => AdminNotification::TYPE_NEW_ORDER,
            'title' => 'Pesanan Baru',
            'message' => "Pesanan baru {$order->formatted_order_number} dari {$order->customer_name} sebesar Rp ".number_format((float) ($order->total ?? 0), 0, ',', '.'),
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'total' => $order->total,
            ],
        ]);

        $this->sendEmailNotification($notification);

        return $notification;
    }

    /**
     * Create notification for a cancellation request.
     */
    public function notifyCancellationRequest(Order $order): AdminNotification
    {
        $notification = AdminNotification::create([
            'type' => AdminNotification::TYPE_CANCELLATION_REQUEST,
            'title' => 'Permintaan Pembatalan',
            'message' => "Pelanggan {$order->customer_name} meminta pembatalan pesanan {$order->formatted_order_number}",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'cancellation_reason' => $order->cancellation_reason,
            ],
        ]);

        $this->sendEmailNotification($notification);

        return $notification;
    }

    /**
     * Send email notification to admin.
     */
    private function sendEmailNotification(AdminNotification $notification): void
    {
        $adminEmail = config('mail.admin_email');

        if ($adminEmail) {
            Mail::to($adminEmail)->send(new AdminNotificationMail($notification));
        }
    }
}
