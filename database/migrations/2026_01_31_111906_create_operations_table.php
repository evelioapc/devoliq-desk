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
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('operator_user_id')->constrained('users')->cascadeOnDelete();
    
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('status')->default('done'); // done|pending|canceled
            $table->timestampTz('performed_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();
    
            $table->index(['company_id', 'performed_at']);
            $table->index(['company_id', 'created_at']);
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
