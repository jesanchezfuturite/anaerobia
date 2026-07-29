<?php

namespace App\Filament\Resources\SolutionPages\Pages;

use App\Filament\Resources\SolutionPages\SolutionPageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSolutionPages extends ListRecords
{
    protected static string $resource = SolutionPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
