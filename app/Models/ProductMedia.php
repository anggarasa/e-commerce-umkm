<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductMedia extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_id',
        'path',
        'thumbnail_path',
        'type',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['url', 'thumbnail_url'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the full URL for the media.
     * Supports both Cloudinary URLs and local storage paths.
     */
    public function getUrlAttribute(): string
    {
        // If it's already a Cloudinary URL, return as-is
        if ($this->isCloudinaryUrl($this->path)) {
            return $this->path;
        }

        // Local storage path
        return asset('storage/'.$this->path);
    }

    /**
     * Get the thumbnail URL for the media.
     * Supports both Cloudinary URLs and local storage paths.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (! $this->thumbnail_path) {
            return null;
        }

        // If it's already a Cloudinary URL, return as-is
        if ($this->isCloudinaryUrl($this->thumbnail_path)) {
            return $this->thumbnail_path;
        }

        // Local storage path
        return asset('storage/'.$this->thumbnail_path);
    }

    /**
     * Check if the given URL is a Cloudinary URL.
     */
    private function isCloudinaryUrl(?string $url): bool
    {
        if (! $url) {
            return false;
        }

        return str_contains($url, 'res.cloudinary.com');
    }
}
