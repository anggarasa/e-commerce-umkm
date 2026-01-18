<?php

namespace Tests\Unit;

use App\Services\CloudinaryService;
use App\Services\MediaCompressionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class MediaCompressionServiceTest extends TestCase
{
    protected MediaCompressionService $service;

    protected CloudinaryService $cloudinaryService;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        // Create a mock CloudinaryService
        $this->cloudinaryService = Mockery::mock(CloudinaryService::class);
        $this->cloudinaryService->shouldReceive('isEnabled')->andReturn(false)->byDefault();

        $this->service = new MediaCompressionService($this->cloudinaryService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
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

    public function test_compress_and_store_saves_image_locally(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 2000, 2000);

        $result = $this->service->compressAndStore($file, 'products');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('path', $result);
        $this->assertArrayHasKey('thumbnail_path', $result);
        $this->assertStringStartsWith('products/', $result['path']);
        $this->assertStringEndsWith('.jpg', $result['path']);
        Storage::disk('public')->assertExists($result['path']);
    }

    public function test_compress_and_store_uses_cloudinary_when_enabled(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);

        $cloudinaryMock = Mockery::mock(CloudinaryService::class);
        $cloudinaryMock->shouldReceive('isEnabled')->andReturn(true);
        $cloudinaryMock->shouldReceive('uploadImage')
            ->once()
            ->with($file, 'products')
            ->andReturn([
                'path' => 'https://res.cloudinary.com/demo/image/upload/test.jpg',
                'thumbnail_path' => 'https://res.cloudinary.com/demo/image/upload/c_fill,w_400,h_400/test.jpg',
                'public_id' => 'products/test',
            ]);

        $service = new MediaCompressionService($cloudinaryMock);
        $result = $service->compressAndStore($file, 'products');

        $this->assertIsArray($result);
        $this->assertEquals('https://res.cloudinary.com/demo/image/upload/test.jpg', $result['path']);
        $this->assertEquals('https://res.cloudinary.com/demo/image/upload/c_fill,w_400,h_400/test.jpg', $result['thumbnail_path']);
    }

    public function test_generate_thumbnail_creates_thumbnail(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $result = $this->service->compressAndStore($file, 'products');

        $this->assertNotNull($result['thumbnail_path']);
        $this->assertStringStartsWith('products/thumbnails/', $result['thumbnail_path']);
        $this->assertStringEndsWith('_thumb.jpg', $result['thumbnail_path']);
        Storage::disk('public')->assertExists($result['thumbnail_path']);
    }

    public function test_generate_thumbnail_returns_null_when_disabled(): void
    {
        config(['media.thumbnail.enabled' => false]);
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $result = $this->service->compressAndStore($file, 'products');

        $this->assertNull($result['thumbnail_path']);
    }

    public function test_store_without_compression_saves_file_locally(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $path = $this->service->storeWithoutCompression($file, 'products');

        $this->assertNotNull($path);
        $this->assertStringStartsWith('products/', $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_store_without_compression_uses_cloudinary_for_video(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $cloudinaryMock = Mockery::mock(CloudinaryService::class);
        $cloudinaryMock->shouldReceive('isEnabled')->andReturn(true);
        $cloudinaryMock->shouldReceive('uploadVideo')
            ->once()
            ->with($file, 'products')
            ->andReturn([
                'path' => 'https://res.cloudinary.com/demo/video/upload/test.mp4',
                'thumbnail_path' => 'https://res.cloudinary.com/demo/video/upload/c_fill,w_400,h_400/test.jpg',
                'public_id' => 'products/test',
            ]);

        $service = new MediaCompressionService($cloudinaryMock);
        $path = $service->storeWithoutCompression($file, 'products');

        $this->assertEquals('https://res.cloudinary.com/demo/video/upload/test.mp4', $path);
    }

    public function test_delete_media_removes_local_files(): void
    {
        $file = UploadedFile::fake()->image('test.jpg', 800, 800);
        $result = $this->service->compressAndStore($file, 'products');

        $this->cloudinaryService->shouldReceive('isCloudinaryUrl')
            ->with($result['path'])
            ->andReturn(false);

        $this->service->deleteMedia($result['path'], $result['thumbnail_path']);

        Storage::disk('public')->assertMissing($result['path']);
        Storage::disk('public')->assertMissing($result['thumbnail_path']);
    }

    public function test_delete_media_removes_cloudinary_files(): void
    {
        $cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v123/products/test.jpg';
        $publicId = 'products/test';

        $cloudinaryMock = Mockery::mock(CloudinaryService::class);
        $cloudinaryMock->shouldReceive('isEnabled')->andReturn(true);
        $cloudinaryMock->shouldReceive('isCloudinaryUrl')
            ->with($cloudinaryUrl)
            ->andReturn(true);
        $cloudinaryMock->shouldReceive('extractPublicIdFromUrl')
            ->with($cloudinaryUrl)
            ->andReturn($publicId);
        $cloudinaryMock->shouldReceive('delete')
            ->once()
            ->with($publicId, 'image')
            ->andReturn(true);

        $service = new MediaCompressionService($cloudinaryMock);
        $service->deleteMedia($cloudinaryUrl);

        // Verify mock expectations were met
        $this->assertTrue(true);
    }

    public function test_should_compress_video_returns_true_for_videos(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $this->assertTrue($this->service->shouldCompressVideo($file));
    }

    public function test_should_compress_video_returns_false_for_images(): void
    {
        $file = UploadedFile::fake()->image('test.jpg');

        $this->assertFalse($this->service->shouldCompressVideo($file));
    }

    public function test_should_compress_video_returns_false_when_disabled(): void
    {
        config(['media.video_compression.enabled' => false]);
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $this->assertFalse($this->service->shouldCompressVideo($file));
    }

    public function test_compress_and_store_video_falls_back_when_ffmpeg_fails(): void
    {
        // FFMpeg is not installed in test environment, so it will fall back
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $result = $this->service->compressAndStoreVideo($file, 'products');

        // Should fall back to storing without compression
        $this->assertIsArray($result);
        $this->assertArrayHasKey('path', $result);
        $this->assertStringStartsWith('products/', $result['path']);
        Storage::disk('public')->assertExists($result['path']);
    }

    public function test_compress_and_store_video_uses_cloudinary_when_enabled(): void
    {
        $file = UploadedFile::fake()->create('test.mp4', 1000, 'video/mp4');

        $cloudinaryMock = Mockery::mock(CloudinaryService::class);
        $cloudinaryMock->shouldReceive('isEnabled')->andReturn(true);
        $cloudinaryMock->shouldReceive('uploadVideo')
            ->once()
            ->with($file, 'products')
            ->andReturn([
                'path' => 'https://res.cloudinary.com/demo/video/upload/test.mp4',
                'thumbnail_path' => 'https://res.cloudinary.com/demo/video/upload/so_1/test.jpg',
                'public_id' => 'products/test',
            ]);

        $service = new MediaCompressionService($cloudinaryMock);
        $result = $service->compressAndStoreVideo($file, 'products');

        $this->assertIsArray($result);
        $this->assertEquals('https://res.cloudinary.com/demo/video/upload/test.mp4', $result['path']);
        $this->assertEquals('https://res.cloudinary.com/demo/video/upload/so_1/test.jpg', $result['thumbnail_path']);
    }

    public function test_generate_video_thumbnail_returns_null_when_disabled(): void
    {
        config(['media.thumbnail.enabled' => false]);

        $result = $this->service->generateVideoThumbnail('some/path.mp4', 'products/thumbnails');

        $this->assertNull($result);
    }

    public function test_is_cloudinary_enabled_returns_config_value(): void
    {
        $this->assertFalse($this->service->isCloudinaryEnabled());
    }
}
