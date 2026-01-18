<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $storeName = \App\Models\Setting::where('key', 'store_name')->value('value');
                if ($storeName) {
                    config(['app.name' => $storeName]);
                }
            }
        } catch (\Throwable $th) {
            //
        }
    }
}
