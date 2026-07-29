<?php

namespace App\Filament\Resources\SolutionPages\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SolutionPagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Página')->searchable(),
                TextColumn::make('slug')->label('Slug'),
                IconColumn::make('published')->label('Publicada')->boolean(),
                TextColumn::make('updated_at')->label('Última edición')->dateTime('d/M/Y H:i')->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
