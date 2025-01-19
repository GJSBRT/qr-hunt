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
        Schema::create('quartet', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('qr_code_uuid')->unique()->constrained('qr_code', 'uuid')->cascadeOnDelete();
            $table->string('category');
            $table->integer('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quartet');
    }
};
