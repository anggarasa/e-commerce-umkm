<?php

namespace App\Mail;

use App\Models\AdminNotification;
use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNotificationMail extends Mailable
{
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public AdminNotification $notification
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $emoji = $this->getTypeEmoji();
        $storeName = Setting::where('key', 'store_name')->value('value') ?? config('app.name');

        return new Envelope(
            subject: "{$emoji} [{$storeName}] {$this->notification->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $data = $this->notification->data ?? [];

        return new Content(
            view: 'emails.admin-notification',
            with: [
                'notification' => $this->notification,
                'orderId' => $data['order_id'] ?? null,
                'orderNumber' => $data['order_number'] ?? null,
                'customerName' => $data['customer_name'] ?? null,
                'total' => $data['total'] ?? null,
                'cancellationReason' => $data['cancellation_reason'] ?? null,
                'actionUrl' => $this->getActionUrl(),
                'actionText' => $this->getActionText(),
                'storeName' => Setting::where('key', 'store_name')->value('value') ?? config('app.name'),
                'typeColor' => $this->getTypeColor(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Get emoji based on notification type.
     */
    private function getTypeEmoji(): string
    {
        return match ($this->notification->type) {
            AdminNotification::TYPE_NEW_ORDER => '🛒',
            AdminNotification::TYPE_CANCELLATION_REQUEST => '⚠️',
            default => '📬',
        };
    }

    /**
     * Get color based on notification type.
     */
    private function getTypeColor(): array
    {
        return match ($this->notification->type) {
            AdminNotification::TYPE_NEW_ORDER => ['bg' => '#d1fae5', 'text' => '#065f46', 'border' => '#10b981'],
            AdminNotification::TYPE_CANCELLATION_REQUEST => ['bg' => '#fef3c7', 'text' => '#92400e', 'border' => '#f59e0b'],
            default => ['bg' => '#e0e7ff', 'text' => '#3730a3', 'border' => '#6366f1'],
        };
    }

    /**
     * Get action URL based on notification type.
     */
    private function getActionUrl(): string
    {
        $data = $this->notification->data ?? [];
        $orderId = $data['order_id'] ?? null;

        if ($orderId) {
            return url("/admin/orders/{$orderId}");
        }

        return url('/admin/orders');
    }

    /**
     * Get action button text.
     */
    private function getActionText(): string
    {
        return match ($this->notification->type) {
            AdminNotification::TYPE_NEW_ORDER => 'Lihat Pesanan',
            AdminNotification::TYPE_CANCELLATION_REQUEST => 'Proses Pembatalan',
            default => 'Lihat Detail',
        };
    }
}
