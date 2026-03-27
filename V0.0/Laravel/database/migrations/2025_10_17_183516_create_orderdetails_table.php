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
        Schema::create('orderdetails', function (Blueprint $table) {
            $table->string('orderNumber', 11);
            $table->string('productCode', 15);
            $table->string('quantityOrdered', 15);
            $table->decimal('priceEach', 10, 2);
            $table->string('orderLineNumber', 6);
            $table->timestamps();

            $table->primary(['orderNumber', 'productCode']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orderdetails');
    }
};
