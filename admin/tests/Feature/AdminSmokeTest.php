<?php

namespace Tests\Feature;

use App\Models\SolutionPage;
use App\Models\User;
use Database\Seeders\SolutionPageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_solution_page(): void
    {
        $this->seed(SolutionPageSeeder::class);

        $this->getJson('/api/v1/soluciones/conveyors')
            ->assertOk()
            ->assertJsonPath('data.slug', 'conveyors')
            ->assertJsonPath('data.hero.badge', 'SISTEMAS DE TRANSPORTE EN LÍNEAS DE PINTURA');
    }

    public function test_api_hides_unpublished_pages(): void
    {
        $this->seed(SolutionPageSeeder::class);
        SolutionPage::where('slug', 'conveyors')->update(['published' => false]);

        $this->getJson('/api/v1/soluciones/conveyors')->assertNotFound();
    }

    public function test_admin_list_and_edit_pages_render(): void
    {
        $this->seed(SolutionPageSeeder::class);
        $user = User::factory()->create();
        $page = SolutionPage::first();

        $this->actingAs($user)->get('/admin/solution-pages')->assertOk();
        $this->actingAs($user)->get("/admin/solution-pages/{$page->id}/edit")->assertOk();
    }
}
