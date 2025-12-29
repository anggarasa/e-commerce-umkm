<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    use HasUuids;

    protected $fillable = [
        'type',
        'title',
        'message',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    /**
     * Notification types.
     */
    public const TYPE_NEW_ORDER = 'new_order';

    public const TYPE_CANCELLATION_REQUEST = 'cancellation_request';

    /**
     * Scope to filter unread notifications.
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope to filter read notifications.
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->whereNotNull('read_at');
    }

    /**
     * Scope to filter by type.
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(): bool
    {
        if ($this->read_at !== null) {
            return false;
        }

        return $this->update(['read_at' => now()]);
    }

    /**
     * Check if notification is read.
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }
}
