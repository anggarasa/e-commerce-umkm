<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | An HTTP or HTTPS URL to notify your application (a webhook) when
    | the process of uploads, deletes, and any API that accepts
    | notification_url has completed.
    |
    */
    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),

    /*
    |--------------------------------------------------------------------------
    | Cloudinary URL
    |--------------------------------------------------------------------------
    |
    | The Cloudinary URL is a combination of your cloud name, API key,
    | and API secret in the format:
    | cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    |
    | You can find this in your Cloudinary Dashboard.
    |
    */
    'cloud_url' => env('CLOUDINARY_URL') ?: 'cloudinary://placeholder:placeholder@placeholder',

    /*
    |--------------------------------------------------------------------------
    | Upload Preset
    |--------------------------------------------------------------------------
    |
    | Upload preset to use for unsigned uploads. Optional.
    |
    */
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    /*
    |--------------------------------------------------------------------------
    | Cloud Name (Alternative Configuration)
    |--------------------------------------------------------------------------
    |
    | If you prefer to use separate environment variables instead of
    | CLOUDINARY_URL, you can configure them here.
    |
    */
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'secure' => env('CLOUDINARY_SECURE', true),
];
