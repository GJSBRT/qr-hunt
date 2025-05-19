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
        Schema::create('territory_koth_claim', function (Blueprint $table) {
            $table->id();
            $table->foreignId('territory_koth_id')->constrained('territory_koth', 'id')->cascadeOnDelete();
            $table->foreignId('claim_team_id')->constrained('team')->cascadeOnDelete();
            $table->timestamp('claimed_at');
            $table->timestamps();
        });

        Schema::table('territory_koth', function (Blueprint $table) {
            $table->dropConstrainedForeignId('claim_team_id');
            $table->dropColumn('claimed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('territory_koth_claim');

        Schema::table('territory_koth', function (Blueprint $table) {
            $table->foreignId('claim_team_id')->nullable()->constrained('team')->nullOnDelete();
            $table->timestamp('claimed_at')->nullable();
        });
    }
};
