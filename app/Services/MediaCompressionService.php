<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaCompressionService
{
    private ImageManager $manager;

    private int $maxWidth;

    private int $maxHeight;

    private int $quality;

    private int $thumbnailWidth;

    private int $thumbnailHeight;

    private int $thumbnailQuality;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver);
        $this->maxWidth = config('media.compression.max_width', 1920);
        $this->maxHeight = config('media.compression.max_height', 1920);
        $this->quality = config('media.compression.quality', 80);
        $this->thumbnailWidth = config('media.thumbnail.width', 400);
        $this->thumbnailHeight = config('media.thumbnail.height', 400);
        $this->thumbnailQuality = config('media.thumbnail.quality', 75);
    }

    /**
     * Check if the file should be compressed (only images).
     */
    public function shouldCompress(UploadedFile $file): bool
    {
        if (! config('media.compression.enabled', true)) {
            return false;
        }

        return str_starts_with($file->getMimeType(), 'image/');
    }

    /**
     * Compress and optionally resize the image, then store it.
     *
     * @return string The path to the stored compressed image
     */
    public function compressAndStore(UploadedFile $file, string $directory = 'products'): string
    {
        $image = $this->manager->read($file->getRealPath());

        // Scale down if exceeds max dimensions (maintains aspect ratio)
        $image->scaleDown(width: $this->maxWidth, height: $this->maxHeight);

        // Encode with quality
        $encoded = $image->toJpeg($this->quality);

        // Generate unique filename
        $filename = uniqid().'_'.time().'.jpg';
        $path = $directory.'/'.$filename;

        // Store the compressed image
        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }

    /**
     * Generate a thumbnail for the given image path.
     *
     * @return string|null The path to the thumbnail, or null if thumbnail generation is disabled
     */
    public function generateThumbnail(string $originalPath, string $directory = 'products/thumbnails'): ?string
    {
        if (! config('media.thumbnail.enabled', true)) {
            return null;
        }

        $fullPath = Storage::disk('public')->path($originalPath);

        if (! file_exists($fullPath)) {
            return null;
        }

        $image = $this->manager->read($fullPath);

        // Cover resize to fit thumbnail dimensions
        $image->cover($this->thumbnailWidth, $this->thumbnailHeight);

        // Encode with thumbnail quality
        $encoded = $image->toJpeg($this->thumbnailQuality);

        // Generate thumbnail filename
        $originalFilename = pathinfo($originalPath, PATHINFO_FILENAME);
        $thumbnailFilename = $originalFilename.'_thumb.jpg';
        $thumbnailPath = $directory.'/'.$thumbnailFilename;

        // Store the thumbnail
        Storage::disk('public')->put($thumbnailPath, (string) $encoded);

        return $thumbnailPath;
    }

    /**
     * Store a file without compression (for videos or when compression is disabled).
     *
     * @return string The path to the stored file
     */
    public function storeWithoutCompression(UploadedFile $file, string $directory = 'products'): string
    {
        return $file->store($directory, 'public');
    }

    /**
     * Delete media files including thumbnail.
     */
    public function deleteMedia(string $path, ?string $thumbnailPath = null): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
            Storage::disk('public')->delete($thumbnailPath);
        }
    }
}
