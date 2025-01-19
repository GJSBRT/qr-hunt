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
        Schema::create('team_qr_code', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('qr_code_uuid')->constrained('qr_code', 'uuid')->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('team')->cascadeOnDelete();
            $table->foreignId('team_player_id')->nullable()->constrained('team_player')->nullOnDelete();
            $table->timestamp('power_used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_qr_code');
    }
};
