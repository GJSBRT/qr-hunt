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
        Schema::create('territory_mission_multiple_choice_answer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('territory_mission_id')->constrained('territory_mission', 'id', 'choice_territory_mission_id')->cascadeOnDelete();
            $table->string('answer');
            $table->boolean('correct');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('territory_mission_multiple_choice_answer');
    }
};
