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
        Schema::create('territory_koth', function (Blueprint $table) {
            $table->id();
            $table->foreignId('territory_id')->constrained('territory_game')->cascadeOnDelete();
            $table->foreignId('claim_team_id')->nullable()->constrained('team')->nullOnDelete();
            $table->timestamp('claimed_at')->nullable();
            $table->float('lat');
            $table->float('lng');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('territory_koth');
    }
};
