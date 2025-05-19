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
        Schema::create('territory_mission_answer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('territory_mission_id')->constrained('territory_mission')->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('team')->cascadeOnDelete();
            $table->foreignId('multiple_choice_id')->nullable()->constrained('territory_mission_multiple_choice_answer')->cascadeOnDelete();
            $table->string('photo_path')->nullable();
            $table->text('open_answer')->nullable();
            $table->boolean('marked_correct')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('territory_mission_answer');
    }
};
