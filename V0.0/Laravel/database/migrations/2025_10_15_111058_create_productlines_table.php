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
        Schema::create('productlines', function (Blueprint $table) {
            $table->string('productLine', 50)->primary();
            $table->string('textDescription', 4000)->nullable();
            $table->mediumText('htmlDescription')->nullable();
            $table->binary('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productlines');
    }
};
