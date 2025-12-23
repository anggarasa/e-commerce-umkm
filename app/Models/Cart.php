<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Session;

class Cart extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'session_id',
    ];

    protected $appends = ['total_items', 'total_price'];

    /**
     * Get the user that owns the cart.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the cart items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get total items count.
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    /**
     * Get total price.
     */
    public function getTotalPriceAttribute(): float
    {
        return $this->items->sum(fn ($item) => $item->subtotal);
    }

    /**
     * Get or create cart for the current user/session.
     */
    public static function current(): self
    {
        $user = auth()->user();

        if ($user) {
            return static::firstOrCreate(
                ['user_id' => $user->id],
                ['session_id' => null]
            );
        }

        $sessionId = Session::getId();

        return static::firstOrCreate(
            ['session_id' => $sessionId],
            ['user_id' => null]
        );
    }

    /**
     * Merge guest cart into user cart on login.
     */
    public static function mergeGuestCart(): void
    {
        $user = auth()->user();
        if (! $user) {
            return;
        }

        $sessionId = Session::getId();
        $guestCart = static::where('session_id', $sessionId)->first();

        if (! $guestCart) {
            return;
        }

        $userCart = static::firstOrCreate(
            ['user_id' => $user->id],
            ['session_id' => null]
        );

        // Merge items
        foreach ($guestCart->items as $guestItem) {
            $existingItem = $userCart->items()
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $guestItem->quantity,
                ]);
            } else {
                $userCart->items()->create([
                    'product_id' => $guestItem->product_id,
                    'quantity' => $guestItem->quantity,
                    'price' => $guestItem->price,
                ]);
            }
        }

        // Delete guest cart
        $guestCart->delete();
    }
}
