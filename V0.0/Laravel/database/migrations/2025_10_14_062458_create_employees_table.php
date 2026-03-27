<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->string('employeeNumber', 11)->primary();
            $table->string('lastName', 50)->nullable();
            $table->string('firstName', 50);
            $table->string('extension', 50);
            $table->string('email', 50);
            $table->string('officeCode', 10);
            $table->string('reportsTo', 11)->nullable();
            $table->string('jobTitle', 50);
            $table->timestamps();

            $table->foreign('officeCode')
                  ->references('officeCode')
                  ->on('offices')
                  ->onDelete('restrict');

            $table->foreign('reportsTo')
                  ->references('employeeNumber')
                  ->on('employees')
                  ->onDelete('restrict')
                  ->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
