<?php

namespace App\Filament\Resources\SolutionPages\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class SolutionPageForm
{
    private static function image(string $name, string $label = 'Imagen'): FileUpload
    {
        return FileUpload::make($name)
            ->label($label)
            ->image()
            ->disk('public')
            ->directory('soluciones/uploads')
            ->visibility('public')
            ->maxSize(8192)
            ->imagePreviewHeight('150');
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Contenido')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('General')
                            ->schema([
                                TextInput::make('name')->label('Nombre (interno)')->required(),
                                TextInput::make('slug')->label('Slug (URL)')->required()->disabledOn('edit'),
                                Toggle::make('published')->label('Publicada'),
                                Section::make('SEO')->schema([
                                    TextInput::make('seo.title')->label('Título SEO'),
                                    Textarea::make('seo.description')->label('Descripción SEO')->rows(2),
                                ]),
                            ]),

                        Tab::make('Hero')
                            ->schema([
                                TextInput::make('hero.badge')->label('Badge (etiqueta superior)'),
                                TextInput::make('hero.title')->label('Título'),
                                Textarea::make('hero.description')->label('Descripción')->rows(3),
                                self::image('hero.image', 'Imagen de fondo'),
                            ]),

                        Tab::make('Introducción')
                            ->schema([
                                Textarea::make('intro.title')->label('Título')->rows(2),
                                Repeater::make('intro.paragraphs')
                                    ->label('Párrafos')
                                    ->schema([
                                        Textarea::make('text')->label('Texto')->rows(3),
                                    ]),
                                self::image('intro.image'),
                            ]),

                        Tab::make('Desafíos')
                            ->schema([
                                TextInput::make('desafios.title')->label('Título'),
                                Textarea::make('desafios.description')->label('Descripción')->rows(2),
                                self::image('desafios.image'),
                                Repeater::make('desafios.tarjetas')
                                    ->label('Tarjetas blancas (frases cortas)')
                                    ->schema([
                                        TextInput::make('text')->label('Texto'),
                                    ]),
                                Repeater::make('desafios.items')
                                    ->label('Desafíos (título + descripción)')
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                    ->schema([
                                        TextInput::make('title')->label('Título'),
                                        Textarea::make('description')->label('Descripción')->rows(3),
                                    ]),
                            ]),

                        Tab::make('CTAs')
                            ->schema([
                                Section::make('CTA intermedio')->schema([
                                    TextInput::make('cta1.title')->label('Título'),
                                    Textarea::make('cta1.description')->label('Descripción')->rows(2),
                                    TextInput::make('cta1.button_label')->label('Texto del botón'),
                                    TextInput::make('cta1.button_url')->label('URL del botón'),
                                ]),
                                Section::make('CTA final (con imagen de fondo)')->schema([
                                    TextInput::make('cta2.title')->label('Título'),
                                    Textarea::make('cta2.description')->label('Descripción')->rows(2),
                                    TextInput::make('cta2.button_label')->label('Texto del botón'),
                                    TextInput::make('cta2.button_url')->label('URL del botón'),
                                    self::image('cta2.image', 'Imagen de fondo'),
                                ]),
                            ]),

                        Tab::make('Ingeniería')
                            ->schema([
                                TextInput::make('ingenieria.badge')->label('Badge'),
                                TextInput::make('ingenieria.title')->label('Título'),
                                Textarea::make('ingenieria.description')->label('Descripción')->rows(2),
                                Repeater::make('ingenieria.cards')
                                    ->label('Tarjetas (la primera es la grande)')
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                    ->schema([
                                        TextInput::make('title')->label('Título'),
                                        Textarea::make('description')->label('Descripción')->rows(3),
                                        self::image('image', 'Imagen de fondo'),
                                    ]),
                            ]),

                        Tab::make('Tipos')
                            ->schema([
                                TextInput::make('tipos.badge')->label('Badge'),
                                TextInput::make('tipos.title')->label('Título'),
                                Textarea::make('tipos.description')->label('Descripción')->rows(3),
                                Section::make('Pestaña 01: Por Ubicación')->schema([
                                    TextInput::make('tipos.ubicacion.label')->label('Nombre de la pestaña'),
                                    TextInput::make('tipos.ubicacion.overhead_title')->label('Título subsección Overhead'),
                                    Repeater::make('tipos.ubicacion.overhead_cards')
                                        ->label('Tarjetas Overhead')
                                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                        ->schema([
                                            TextInput::make('title')->label('Título'),
                                            self::image('image'),
                                        ]),
                                    TextInput::make('tipos.ubicacion.floor_title')->label('Título subsección Floor'),
                                    Repeater::make('tipos.ubicacion.floor_cards')
                                        ->label('Tarjetas Floor')
                                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                        ->schema([
                                            TextInput::make('title')->label('Título'),
                                            self::image('image'),
                                        ]),
                                ]),
                                Section::make('Pestaña 02: Por Tipo de Operación')->schema([
                                    TextInput::make('tipos.operacion.label')->label('Nombre de la pestaña'),
                                    TextInput::make('tipos.operacion.title')->label('Título'),
                                    Textarea::make('tipos.operacion.description')->label('Descripción')->rows(2),
                                    Repeater::make('tipos.operacion.items')
                                        ->label('Modos de operación')
                                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                        ->schema([
                                            TextInput::make('title')->label('Título'),
                                            Textarea::make('description')->label('Descripción')->rows(2),
                                        ]),
                                    self::image('tipos.operacion.image'),
                                ]),
                            ]),

                        Tab::make('Resultados')
                            ->schema([
                                TextInput::make('resultados.badge')->label('Badge'),
                                TextInput::make('resultados.title')->label('Título'),
                                Textarea::make('resultados.description')->label('Descripción')->rows(3),
                                Repeater::make('resultados.cards')
                                    ->label('Tarjetas destacadas (frases)')
                                    ->schema([
                                        Textarea::make('text')->label('Texto')->rows(2),
                                    ]),
                            ]),

                        Tab::make('Normatividad')
                            ->schema([
                                TextInput::make('normatividad.badge')->label('Badge'),
                                TextInput::make('normatividad.title')->label('Título'),
                                Textarea::make('normatividad.description')->label('Descripción')->rows(3),
                                Repeater::make('normatividad.bullets')
                                    ->label('Puntos (viñetas)')
                                    ->schema([
                                        TextInput::make('text')->label('Texto'),
                                    ]),
                            ]),

                        Tab::make('FAQs')
                            ->schema([
                                TextInput::make('faqs.badge')->label('Badge'),
                                TextInput::make('faqs.title')->label('Título'),
                                Repeater::make('faqs.items')
                                    ->label('Preguntas')
                                    ->itemLabel(fn (array $state): ?string => $state['question'] ?? null)
                                    ->schema([
                                        TextInput::make('question')->label('Pregunta'),
                                        Textarea::make('answer')->label('Respuesta')->rows(4),
                                    ]),
                            ]),

                        Tab::make('Galería')
                            ->schema([
                                TextInput::make('galeria.badge')->label('Badge'),
                                TextInput::make('galeria.title')->label('Título'),
                                Repeater::make('galeria.images')
                                    ->label('Imágenes')
                                    ->itemLabel(fn (array $state): ?string => $state['alt'] ?? null)
                                    ->schema([
                                        self::image('image'),
                                        TextInput::make('alt')->label('Texto alternativo (SEO)'),
                                    ]),
                            ]),
                    ]),
            ]);
    }
}
