<?php

namespace App\Filament\Resources\SolutionPages\Pages;

use App\Filament\Resources\SolutionPages\SolutionPageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSolutionPage extends EditRecord
{
    protected static string $resource = SolutionPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
