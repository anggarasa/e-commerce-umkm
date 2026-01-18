<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private string $folder;

    private array $imageTransformation;

    private array $videoTransformation;

    private array $thumbnailSettings;

    private ?string $cloudName;

    public function __construct()
    {
        $this->folder = config('media.cloudinary.folder', 'products');
        $this->imageTransformation = config('media.cloudinary.image_transformation', []);
        $this->videoTransformation = config('media.cloudinary.video_transformation', []);
        $this->thumbnailSettings = config('media.cloudinary.thumbnail', [
            'width' => 400,
            'height' => 400,
            'crop' => 'fill',
        ]);
        $this->cloudName = config('cloudinary.cloud_name');
    }

    /**
     * Check if Cloudinary is enabled.
     */
    public function isEnabled(): bool
    {
        return config('media.cloudinary.enabled', false);
    }

    /**
     * Upload an image to Cloudinary.
     *
     * @return array{path: string, thumbnail_path: string|null, public_id: string}
     */
    public function uploadImage(UploadedFile $file, string $folder = ''): array
    {
        $uploadFolder = $folder ?: $this->folder;

        $result = Cloudinary::uploadApi()->upload($file->getRealPath(), [
            'folder' => $uploadFolder,
            'resource_type' => 'image',
            'transformation' => [
                'quality' => $this->imageTransformation['quality'] ?? 'auto:good',
                'fetch_format' => $this->imageTransformation['fetch_format'] ?? 'auto',
            ],
        ]);

        $publicId = $result['public_id'];
        $secureUrl = $result['secure_url'];

        // Generate thumbnail URL with transformations
        $thumbnailUrl = $this->generateThumbnailUrl($publicId);

        return [
            'path' => $secureUrl,
            'thumbnail_path' => $thumbnailUrl,
            'public_id' => $publicId,
        ];
    }

    /**
     * Upload a video to Cloudinary.
     *
     * @return array{path: string, thumbnail_path: string|null, public_id: string}
     */
    public function uploadVideo(UploadedFile $file, string $folder = ''): array
    {
        $uploadFolder = $folder ?: $this->folder;

        $result = Cloudinary::uploadApi()->upload($file->getRealPath(), [
            'folder' => $uploadFolder,
            'resource_type' => 'video',
            'transformation' => [
                'quality' => $this->videoTransformation['quality'] ?? 'auto:good',
            ],
        ]);

        $publicId = $result['public_id'];
        $secureUrl = $result['secure_url'];

        // Generate video thumbnail (poster frame)
        $thumbnailUrl = $this->generateVideoThumbnailUrl($publicId);

        return [
            'path' => $secureUrl,
            'thumbnail_path' => $thumbnailUrl,
            'public_id' => $publicId,
        ];
    }

    /**
     * Generate a thumbnail URL for an image.
     */
    public function generateThumbnailUrl(string $publicId): string
    {
        $cloudName = $this->cloudName;

        $width = $this->thumbnailSettings['width'];
        $height = $this->thumbnailSettings['height'];
        $crop = $this->thumbnailSettings['crop'];

        return "https://res.cloudinary.com/{$cloudName}/image/upload/c_{$crop},w_{$width},h_{$height},q_auto,f_auto/{$publicId}";
    }

    /**
     * Generate a thumbnail URL from a video (poster frame).
     */
    public function generateVideoThumbnailUrl(string $publicId): string
    {
        $cloudName = $this->cloudName;

        $width = $this->thumbnailSettings['width'];
        $height = $this->thumbnailSettings['height'];
        $crop = $this->thumbnailSettings['crop'];

        // Get frame at 1 second as thumbnail
        return "https://res.cloudinary.com/{$cloudName}/video/upload/c_{$crop},w_{$width},h_{$height},q_auto,f_jpg,so_1/{$publicId}";
    }

    /**
     * Delete a media file from Cloudinary.
     */
    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            Cloudinary::uploadApi()->destroy($publicId, [
                'resource_type' => $resourceType,
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Extract public ID from a Cloudinary URL.
     */
    public function extractPublicIdFromUrl(string $url): ?string
    {
        if (! $this->isCloudinaryUrl($url)) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        // Find the position of 'upload/' to start parsing
        $pos = strpos($path, '/upload/');
        if ($pos === false) {
            return null;
        }

        // Get everything after '/upload/'
        $rest = substr($path, $pos + strlen('/upload/'));
        $parts = explode('/', $rest);

        $publicIdParts = [];

        foreach ($parts as $part) {
            // If the part matches a version (e.g., v123456), it resets the public ID accumulation
            // because everything before the version is considered transformation parameters or irrelevant.
            if (preg_match('/^v\d+$/', $part)) {
                $publicIdParts = [];
                continue;
            }

            $publicIdParts[] = $part;
        }

        // Reassemble the remaining parts
        $fullPath = implode('/', $publicIdParts);

        // Remove the file extension (last dot onwards)
        // Cloudinary Public IDs do not include the extension
        $lastDot = strrpos($fullPath, '.');
        if ($lastDot !== false) {
            // Check if the extension is valid (alphanumeric) to avoid stripping parts of the ID that just happen to have a dot
            // Although standard Cloudinary URLs always end with format extension.
            $fullPath = substr($fullPath, 0, $lastDot);
        }

        return $fullPath;
    }

    /**
     * Check if a URL is a Cloudinary URL.
     */
    public function isCloudinaryUrl(string $url): bool
    {
        return str_contains($url, 'res.cloudinary.com');
    }
}
