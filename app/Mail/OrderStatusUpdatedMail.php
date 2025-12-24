<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Status colors configuration.
     */
    private array $statusColors = [
        'pending' => ['bg' => '#fef3c7', 'text' => '#92400e'],
        'processing' => ['bg' => '#dbeafe', 'text' => '#1e40af'],
        'shipped' => ['bg' => '#e0e7ff', 'text' => '#3730a3'],
        'delivered' => ['bg' => '#d1fae5', 'text' => '#065f46'],
        'cancelled' => ['bg' => '#fee2e2', 'text' => '#991b1b'],
    ];

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Order $order,
        public string $oldStatus,
        public string $newStatus
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $emoji = $this->getStatusEmoji($this->newStatus);
        $statusLabels = Order::STATUSES;
        $newStatusLabel = $statusLabels[$this->newStatus] ?? $this->newStatus;

        return new Envelope(
            subject: "{$emoji} Update Pesanan #{$this->order->order_number} - {$newStatusLabel}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $statusLabels = Order::STATUSES;

        return new Content(
            view: 'emails.order-status-updated',
            with: [
                'order' => $this->order,
                'oldStatusLabel' => $statusLabels[$this->oldStatus] ?? $this->oldStatus,
                'newStatusLabel' => $statusLabels[$this->newStatus] ?? $this->newStatus,
                'oldStatusColor' => $this->statusColors[$this->oldStatus] ?? ['bg' => '#f1f5f9', 'text' => '#475569'],
                'newStatusColor' => $this->statusColors[$this->newStatus] ?? ['bg' => '#f1f5f9', 'text' => '#475569'],
                'statusEmoji' => $this->getStatusEmoji($this->newStatus),
                'statusMessage' => $this->getStatusMessage(),
                'statusMessageTitle' => $this->getStatusMessageTitle(),
                'statusMessageBg' => $this->getStatusMessageBg(),
                'statusMessageColor' => $this->getStatusMessageColor(),

                'actionUrl' => url("/orders/{$this->order->order_number}"),
                'storeName' => \App\Models\Setting::where('key', 'store_name')->value('value') ?? config('app.name'),
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
     * Get the status icon emoji.
     */
    private function getStatusEmoji(string $status): string
    {
        return match ($status) {
            'pending' => '⏳',
            'processing' => '🔄',
            'shipped' => '🚚',
            'delivered' => '✅',
            'cancelled' => '❌',
            default => '📦',
        };
    }

    /**
     * Get the status message title.
     */
    private function getStatusMessageTitle(): ?string
    {
        return match ($this->newStatus) {
            'processing' => 'Pesanan Sedang Diproses',
            'shipped' => 'Pesanan Dalam Pengiriman',
            'delivered' => 'Pesanan Telah Diterima',
            'cancelled' => 'Pesanan Dibatalkan',
            default => null,
        };
    }

    /**
     * Get the status message description.
     */
    private function getStatusMessage(): ?string
    {
        return match ($this->newStatus) {
            'processing' => 'Tim kami sedang menyiapkan pesanan Anda dengan teliti. Harap tunggu update selanjutnya!',
            'shipped' => 'Pesanan Anda sudah dalam perjalanan! Silakan tunggu paket Anda tiba.',
            'delivered' => 'Terima kasih telah berbelanja di toko kami! Semoga Anda puas dengan pesanan Anda.',
            'cancelled' => 'Pesanan Anda telah dibatalkan. Silakan hubungi kami jika ada pertanyaan.',
            default => null,
        };
    }

    /**
     * Get the status message background color.
     */
    private function getStatusMessageBg(): string
    {
        return match ($this->newStatus) {
            'processing' => '#dbeafe',
            'shipped' => '#e0e7ff',
            'delivered' => '#d1fae5',
            'cancelled' => '#fee2e2',
            default => '#f1f5f9',
        };
    }

    /**
     * Get the status message text color.
     */
    private function getStatusMessageColor(): string
    {
        return match ($this->newStatus) {
            'processing' => '#1e40af',
            'shipped' => '#3730a3',
            'delivered' => '#065f46',
            'cancelled' => '#991b1b',
            default => '#475569',
        };
    }
}
