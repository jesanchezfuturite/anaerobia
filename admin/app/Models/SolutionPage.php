<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SolutionPage extends Model
{
    protected $guarded = [];

    protected $casts = [
        'published' => 'boolean',
        'seo' => 'array',
        'hero' => 'array',
        'intro' => 'array',
        'desafios' => 'array',
        'cta1' => 'array',
        'ingenieria' => 'array',
        'tipos' => 'array',
        'resultados' => 'array',
        'cta2' => 'array',
        'normatividad' => 'array',
        'faqs' => 'array',
        'galeria' => 'array',
    ];

    /**
     * Payload para la API: convierte las rutas de imagen guardadas en el
     * disco "public" a URLs absolutas que el sitio Astro puede consumir.
     */
    public function toApiPayload(): array
    {
        $sections = [
            'seo', 'hero', 'intro', 'desafios', 'cta1', 'ingenieria',
            'tipos', 'resultados', 'cta2', 'normatividad', 'faqs', 'galeria',
        ];

        $payload = ['slug' => $this->slug, 'name' => $this->name];

        foreach ($sections as $section) {
            $payload[$section] = $this->resolveImages($this->{$section} ?? []);
        }

        return $payload;
    }

    private function resolveImages(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map(fn ($v) => $this->resolveImages($v), $value);
        }

        if (is_string($value) && preg_match('/\.(webp|jpe?g|png|gif|svg|avif)$/i', $value) && ! str_starts_with($value, 'http') && ! str_starts_with($value, '/')) {
            return Storage::disk('public')->url($value);
        }

        return $value;
    }
}
