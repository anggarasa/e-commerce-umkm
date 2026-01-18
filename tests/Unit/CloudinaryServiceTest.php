<?php

namespace Tests\Unit;

use App\Services\CloudinaryService;
use Tests\TestCase;

class CloudinaryServiceTest extends TestCase
{
    private CloudinaryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CloudinaryService();
    }

    public function test_extract_public_id_from_image_url_with_version()
    {
        $url = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertEquals('sample', $publicId);
    }

    public function test_extract_public_id_from_image_url_without_version()
    {
        $url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertEquals('sample', $publicId);
    }

    public function test_extract_public_id_from_image_url_with_folder()
    {
        $url = 'https://res.cloudinary.com/demo/image/upload/v12345/folder/subfolder/sample.jpg';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertEquals('folder/subfolder/sample', $publicId);
    }

    public function test_extract_public_id_from_video_url_with_mp4_extension()
    {
        $url = 'https://res.cloudinary.com/demo/video/upload/v12345/my_video.mp4';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertEquals('my_video', $publicId);
    }

    public function test_extract_public_id_from_url_with_transformations()
    {
        $url = 'https://res.cloudinary.com/demo/image/upload/w_400,h_400/v12345/sample.jpg';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertEquals('sample', $publicId);
    }

    public function test_extract_public_id_returns_null_for_non_cloudinary_url()
    {
        $url = 'https://example.com/image.jpg';
        $publicId = $this->service->extractPublicIdFromUrl($url);
        $this->assertNull($publicId);
    }
}
