<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Media Compression Settings
    |--------------------------------------------------------------------------
    |
    | Configure how uploaded images are compressed and resized.
    |
    */

    'compression' => [
        'enabled' => env('MEDIA_COMPRESSION_ENABLED', true),
        'quality' => env('MEDIA_COMPRESSION_QUALITY', 80),
        'max_width' => 1920,
        'max_height' => 1920,
    ],

    /*
    |--------------------------------------------------------------------------
    | Thumbnail Settings
    |--------------------------------------------------------------------------
    |
    | Configure thumbnail generation for product media.
    |
    */

    'thumbnail' => [
        'enabled' => env('MEDIA_THUMBNAIL_ENABLED', true),
        'width' => 400,
        'height' => 400,
        'quality' => 75,
    ],

    /*
    |--------------------------------------------------------------------------
    | Video Compression Settings
    |--------------------------------------------------------------------------
    |
    | Configure how uploaded videos are compressed and resized.
    |
    */

    'video_compression' => [
        'enabled' => env('VIDEO_COMPRESSION_ENABLED', true),
        'bitrate' => env('VIDEO_BITRATE', 1000), // kbps
        'max_width' => env('VIDEO_MAX_WIDTH', 1280),
        'max_height' => env('VIDEO_MAX_HEIGHT', 720),
        'format' => 'mp4',
    ],
];
