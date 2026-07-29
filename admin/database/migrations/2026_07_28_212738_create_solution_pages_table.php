<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solution_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->boolean('published')->default(true);
            $table->json('seo')->nullable();
            $table->json('hero')->nullable();
            $table->json('intro')->nullable();
            $table->json('desafios')->nullable();
            $table->json('cta1')->nullable();
            $table->json('ingenieria')->nullable();
            $table->json('tipos')->nullable();
            $table->json('resultados')->nullable();
            $table->json('cta2')->nullable();
            $table->json('normatividad')->nullable();
            $table->json('faqs')->nullable();
            $table->json('galeria')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solution_pages');
    }
};
