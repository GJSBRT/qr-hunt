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
        Schema::create('power', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('game')->cascadeOnDelete();
            $table->foreignId('owner_team_id')->nullable()->constrained('team')->nullOnDelete();
            $table->foreignId('used_on_team_id')->nullable()->constrained('team')->nullOnDelete();
            $table->foreignId('taken_from_team_id')->nullable()->constrained('team')->nullOnDelete();
            $table->boolean('power_up');
            $table->boolean('applies_to_other_team');
            $table->string('description')->nullable();
            $table->string('type');
            $table->json('extra_fields');
            $table->timestamp('claimed_at');
            $table->timestamp('used_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('power');
    }
};
