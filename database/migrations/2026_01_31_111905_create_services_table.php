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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 12, 2)->default(0);
            $table->unsignedInteger('duration_minutes')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
    
            $table->index(['company_id', 'created_at']);
            $table->unique(['company_id', 'name']);
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
