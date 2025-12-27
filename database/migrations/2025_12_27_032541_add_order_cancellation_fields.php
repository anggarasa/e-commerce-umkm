<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'cancellation_requested')) {
                $table->boolean('cancellation_requested')->default(false)->after('admin_notes');
            }
            if (! Schema::hasColumn('orders', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('cancellation_requested');
            }
            if (! Schema::hasColumn('orders', 'cancellation_requested_at')) {
                $table->timestamp('cancellation_requested_at')->nullable()->after('cancellation_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['cancellation_requested', 'cancellation_reason', 'cancellation_requested_at']);
        });
    }
};
