<?php

namespace App\Filament\Resources\SolutionPages;

use App\Filament\Resources\SolutionPages\Pages\CreateSolutionPage;
use App\Filament\Resources\SolutionPages\Pages\EditSolutionPage;
use App\Filament\Resources\SolutionPages\Pages\ListSolutionPages;
use App\Filament\Resources\SolutionPages\Schemas\SolutionPageForm;
use App\Filament\Resources\SolutionPages\Tables\SolutionPagesTable;
use App\Models\SolutionPage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SolutionPageResource extends Resource
{
    protected static ?string $model = SolutionPage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $modelLabel = 'Página de Solución';

    protected static ?string $pluralModelLabel = 'Páginas de Soluciones';

    protected static ?string $navigationLabel = 'Soluciones';

    public static function form(Schema $schema): Schema
    {
        return SolutionPageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SolutionPagesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSolutionPages::route('/'),
            'create' => CreateSolutionPage::route('/create'),
            'edit' => EditSolutionPage::route('/{record}/edit'),
        ];
    }
}
