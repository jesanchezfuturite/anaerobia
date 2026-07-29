<?php

use App\Http\Controllers\Api\SolutionPageController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/soluciones', [SolutionPageController::class, 'index']);
    Route::get('/soluciones/{slug}', [SolutionPageController::class, 'show']);
});
