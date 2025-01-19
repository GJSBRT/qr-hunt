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
        Schema::create('qr_code', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->foreignId('game_id')->constrained('game')->cascadeOnDelete();
            $table->foreignId('power_id')->nullable()->constrained('power')->nullOnDelete();
            $table->string('description')->nullable();
            $table->integer('max_scans')->nullable();
            $table->float('location_lat')->nullable();
            $table->float('location_lng')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_code');
    }
};
