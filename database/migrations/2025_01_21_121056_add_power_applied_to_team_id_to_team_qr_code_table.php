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
        Schema::table('team_qr_code', function (Blueprint $table) {
            $table->foreignId('power_applied_to_team_id')->nullable()->constrained('team')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_qr_code', function (Blueprint $table) {
            $table->dropColumn('power_applied_to_team_id');
        });
    }
};
