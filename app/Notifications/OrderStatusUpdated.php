<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Order $order,
        public string $oldStatus,
        public string $newStatus
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusLabels = Order::STATUSES;
        $oldStatusLabel = $statusLabels[$this->oldStatus] ?? $this->oldStatus;
        $newStatusLabel = $statusLabels[$this->newStatus] ?? $this->newStatus;

        $message = (new MailMessage)
            ->subject("Update Pesanan #{$this->order->order_number}")
            ->greeting("Halo {$this->order->customer_name}!")
            ->line('Status pesanan Anda telah diperbarui.')
            ->line("**Nomor Pesanan:** #{$this->order->order_number}")
            ->line("**Status Sebelumnya:** {$oldStatusLabel}")
            ->line("**Status Baru:** {$newStatusLabel}");

        // Add specific message based on new status
        $message = match ($this->newStatus) {
            'processing' => $message->line('Pesanan Anda sedang diproses oleh tim kami.'),
            'shipped' => $message->line('Pesanan Anda sudah dikirim! Silakan tunggu paket Anda.'),
            'delivered' => $message->line('Pesanan Anda telah sampai. Terima kasih telah berbelanja!'),
            'cancelled' => $message->line('Pesanan Anda telah dibatalkan. Silakan hubungi kami jika ada pertanyaan.'),
            default => $message,
        };

        // Add order items summary
        $message->line('---')
            ->line('**Detail Pesanan:**');

        foreach ($this->order->items as $item) {
            $message->line("• {$item->product_name} x{$item->quantity} - Rp ".number_format((float) $item->subtotal, 0, ',', '.'));
        }

        $message->line('---')
            ->line('**Total:** Rp '.number_format((float) $this->order->total, 0, ',', '.'))
            ->action('Lihat Detail Pesanan', url("/orders/{$this->order->order_number}"))
            ->line('Terima kasih telah berbelanja di toko kami!');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
        ];
    }
}
