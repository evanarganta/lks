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
        Schema::create('payments', function (Blueprint $table) {
            $table->string('customerNumber', 10);
            $table->string('checkNumber', 50);
            $table->date('paymentDate');
            $table->decimal('amount', 10, 2);
            $table->timestamps();

            $table->primary(['customerNumber', 'checkNumber']);
            
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
        Schema::dropIfExists('payments');
    }
};
