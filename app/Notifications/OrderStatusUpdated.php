<?php

namespace App\Notifications;

use App\Mail\OrderStatusUpdatedMail;
use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderStatusUpdated extends Notification
{
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
    public function toMail(object $notifiable): OrderStatusUpdatedMail
    {
        $email = $notifiable->routes['mail'] ?? $notifiable->email ?? $this->order->customer_email;

        return (new OrderStatusUpdatedMail(
            order: $this->order,
            oldStatus: $this->oldStatus,
            newStatus: $this->newStatus
        ))->to($email);
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
