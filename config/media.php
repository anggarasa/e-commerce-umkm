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
];
