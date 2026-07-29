<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SolutionPage;
use Illuminate\Http\JsonResponse;

class SolutionPageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = SolutionPage::where('published', true)
            ->get(['slug', 'name', 'updated_at']);

        return response()->json(['data' => $pages]);
    }

    public function show(string $slug): JsonResponse
    {
        $page = SolutionPage::where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return response()->json(['data' => $page->toApiPayload()]);
    }
}
