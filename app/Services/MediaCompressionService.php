<?php

namespace App\Services;

use FFMpeg\Format\Video\X264;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class MediaCompressionService
{
    private ImageManager $manager;

    private int $maxWidth;

    private int $maxHeight;

    private int $quality;

    private int $thumbnailWidth;

    private int $thumbnailHeight;

    private int $thumbnailQuality;

    private int $videoBitrate;

    private int $videoMaxWidth;

    private int $videoMaxHeight;

    private CloudinaryService $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
        $this->manager = new ImageManager(new Driver);
        $this->maxWidth = config('media.compression.max_width', 1920);
        $this->maxHeight = config('media.compression.max_height', 1920);
        $this->quality = config('media.compression.quality', 80);
        $this->thumbnailWidth = config('media.thumbnail.width', 400);
        $this->thumbnailHeight = config('media.thumbnail.height', 400);
        $this->thumbnailQuality = config('media.thumbnail.quality', 75);
        $this->videoBitrate = config('media.video_compression.bitrate', 1000);
        $this->videoMaxWidth = config('media.video_compression.max_width', 1280);
        $this->videoMaxHeight = config('media.video_compression.max_height', 720);
    }

    /**
     * Check if Cloudinary is enabled.
     */
    public function isCloudinaryEnabled(): bool
    {
        return $this->cloudinaryService->isEnabled();
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
     * Check if the video file should be compressed.
     */
    public function shouldCompressVideo(UploadedFile $file): bool
    {
        if (! config('media.video_compression.enabled', true)) {
            return false;
        }

        return str_starts_with($file->getMimeType(), 'video/');
    }

    /**
     * Compress and optionally resize the image, then store it.
     * If Cloudinary is enabled, uploads to Cloudinary instead of local storage.
     *
     * @return array{path: string, thumbnail_path: string|null}
     */
    public function compressAndStore(UploadedFile $file, string $directory = 'products'): array
    {
        // Use Cloudinary if enabled
        if ($this->isCloudinaryEnabled()) {
            $result = $this->cloudinaryService->uploadImage($file, $directory);

            return [
                'path' => $result['path'],
                'thumbnail_path' => $result['thumbnail_path'],
            ];
        }

        // Local storage with compression
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

        // Generate thumbnail
        $thumbnailPath = $this->generateThumbnail($path, $directory.'/thumbnails');

        return [
            'path' => $path,
            'thumbnail_path' => $thumbnailPath,
        ];
    }

    /**
     * Compress and store video using FFMpeg or Cloudinary.
     *
     * @return array{path: string, thumbnail_path: string|null}
     */
    public function compressAndStoreVideo(UploadedFile $file, string $directory = 'products'): array
    {
        // Use Cloudinary if enabled
        if ($this->isCloudinaryEnabled()) {
            $result = $this->cloudinaryService->uploadVideo($file, $directory);

            return [
                'path' => $result['path'],
                'thumbnail_path' => $result['thumbnail_path'],
            ];
        }

        // Local storage with FFMpeg compression
        // First, store the original file temporarily
        $tempPath = $file->store('temp', 'public');

        // Generate unique filename for compressed video
        $filename = uniqid().'_'.time().'.mp4';
        $outputPath = $directory.'/'.$filename;

        try {
            // Create format with compression settings
            $format = (new X264)
                ->setKiloBitrate($this->videoBitrate)
                ->setAudioKiloBitrate(128);

            // Open the video and apply compression
            FFMpeg::fromDisk('public')
                ->open($tempPath)
                ->addFilter(function ($filters) {
                    // Scale video to max dimensions while maintaining aspect ratio
                    $filters->resize(
                        new \FFMpeg\Coordinate\Dimension($this->videoMaxWidth, $this->videoMaxHeight),
                        \FFMpeg\Filters\Video\ResizeFilter::RESIZEMODE_SCALE_WIDTH
                    );
                })
                ->export()
                ->toDisk('public')
                ->inFormat($format)
                ->save($outputPath);

            // Clean up temp file
            Storage::disk('public')->delete($tempPath);

            // Generate video thumbnail
            $thumbnailPath = $this->generateVideoThumbnail($outputPath, $directory.'/thumbnails');

            return [
                'path' => $outputPath,
                'thumbnail_path' => $thumbnailPath,
            ];
        } catch (\Exception $e) {
            // If compression fails, clean up and store without compression
            Storage::disk('public')->delete($tempPath);

            // Fall back to storing without compression
            $result = $this->storeWithoutCompression($file, $directory);

            return [
                'path' => $result,
                'thumbnail_path' => null,
            ];
        }
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
     * Generate a thumbnail from a video file.
     *
     * @return string|null The path to the thumbnail
     */
    public function generateVideoThumbnail(string $videoPath, string $directory = 'products/thumbnails'): ?string
    {
        if (! config('media.thumbnail.enabled', true)) {
            return null;
        }

        try {
            // Generate thumbnail filename
            $originalFilename = pathinfo($videoPath, PATHINFO_FILENAME);
            $thumbnailFilename = $originalFilename.'_thumb.jpg';
            $thumbnailPath = $directory.'/'.$thumbnailFilename;

            // Extract frame at 1 second (or beginning if video is shorter)
            FFMpeg::fromDisk('public')
                ->open($videoPath)
                ->getFrameFromSeconds(1)
                ->export()
                ->toDisk('public')
                ->save($thumbnailPath);

            // Resize the thumbnail to match image thumbnails
            $fullPath = Storage::disk('public')->path($thumbnailPath);
            $image = $this->manager->read($fullPath);
            $image->cover($this->thumbnailWidth, $this->thumbnailHeight);
            $encoded = $image->toJpeg($this->thumbnailQuality);
            Storage::disk('public')->put($thumbnailPath, (string) $encoded);

            return $thumbnailPath;
        } catch (\Exception $e) {
            // If thumbnail generation fails, return null
            return null;
        }
    }

    /**
     * Store a file without compression (for videos or when compression is disabled).
     *
     * @return string The path to the stored file
     */
    public function storeWithoutCompression(UploadedFile $file, string $directory = 'products'): string
    {
        // Use Cloudinary if enabled
        if ($this->isCloudinaryEnabled()) {
            $isVideo = str_starts_with($file->getMimeType(), 'video/');
            if ($isVideo) {
                $result = $this->cloudinaryService->uploadVideo($file, $directory);
            } else {
                $result = $this->cloudinaryService->uploadImage($file, $directory);
            }

            return $result['path'];
        }

        return $file->store($directory, 'public');
    }

    /**
     * Delete media files including thumbnail.
     */
    public function deleteMedia(string $path, ?string $thumbnailPath = null): void
    {
        // Check if it's a Cloudinary URL
        if ($this->cloudinaryService->isCloudinaryUrl($path)) {
            $publicId = $this->cloudinaryService->extractPublicIdFromUrl($path);
            if ($publicId) {
                // Determine resource type from URL
                $resourceType = str_contains($path, '/video/') ? 'video' : 'image';
                $this->cloudinaryService->delete($publicId, $resourceType);
            }

            return;
        }

        // Local storage deletion
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
            Storage::disk('public')->delete($thumbnailPath);
        }
    }
}
