<?php

namespace Tests\Unit;

use App\Services\MediaCompressionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaCompressionServiceTest extends TestCase
{
    protected MediaCompressionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->service = new MediaCompressionService;
    }

    public function test_should_compress_returns_true_for_images(): void
    {
        $file = UploadedFile::fake()->image('test.jpg');

        $this->assertTrue($this->service->shouldCompress($file));
    }

    public function test_should_compress_returns_false_for_videos(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $this->assertFalse($this->service->shouldCompress($file));
    }

    public function test_should_compress_returns_false_when_disabled(): void
    {
        config(['media.compression.enabled' => false]);
        $file = UploadedFile::fake()->image('test.jpg');

        $this->assertFalse($this->service->shouldCompress($file));
    }

    public function test_compress_and_store_saves_image(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 2000, 2000);

        $path = $this->service->compressAndStore($file, 'products');

        $this->assertNotNull($path);
        $this->assertStringStartsWith('products/', $path);
        $this->assertStringEndsWith('.jpg', $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_generate_thumbnail_creates_thumbnail(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $path = $this->service->compressAndStore($file, 'products');

        $thumbnailPath = $this->service->generateThumbnail($path, 'products/thumbnails');

        $this->assertNotNull($thumbnailPath);
        $this->assertStringStartsWith('products/thumbnails/', $thumbnailPath);
        $this->assertStringEndsWith('_thumb.jpg', $thumbnailPath);
        Storage::disk('public')->assertExists($thumbnailPath);
    }

    public function test_generate_thumbnail_returns_null_when_disabled(): void
    {
        config(['media.thumbnail.enabled' => false]);
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $path = $this->service->compressAndStore($file, 'products');

        $thumbnailPath = $this->service->generateThumbnail($path, 'products/thumbnails');

        $this->assertNull($thumbnailPath);
    }

    public function test_store_without_compression_saves_file(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $path = $this->service->storeWithoutCompression($file, 'products');

        $this->assertNotNull($path);
        $this->assertStringStartsWith('products/', $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_delete_media_removes_files(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $path = $this->service->compressAndStore($file, 'products');
        $thumbnailPath = $this->service->generateThumbnail($path, 'products/thumbnails');

        $this->service->deleteMedia($path, $thumbnailPath);

        Storage::disk('public')->assertMissing($path);
        Storage::disk('public')->assertMissing($thumbnailPath);
    }
}
