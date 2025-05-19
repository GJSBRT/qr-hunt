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
        Schema::table('territory_area', function (Blueprint $table) {
            $table->foreignId('mission_id')->nullable()->constrained('territory_mission')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('territory_area', function (Blueprint $table) {
            $table->dropColumn('mission_id');
        });
    }
};
