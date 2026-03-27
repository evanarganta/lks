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
        Schema::create('orders', function (Blueprint $table) {
            $table->date('orderDate');
            $table->date('requiredDate');
            $table->date('shippedDate');
            $table->string('status', 15);
            $table->string('comments', 4000);
            $table->string('customerNumber', 11);
            $table->timestamps();

            $table->foreign('customerNumber')
                  ->references('customerNumber')
                  ->on('customers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
