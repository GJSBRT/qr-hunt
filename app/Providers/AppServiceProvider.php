<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public $singletons = [
        \Illuminate\Contracts\Console\Kernel::class => \App\Console\Kernel::class
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Auth::viaRequest('guest', function (Request $request) {
            if ($request->user()) {
                return $request->user();
            }

            return new User();
        });

        // Load migrations from GameModes.
        $directories = glob('app/GameModes/*/migrations', GLOB_ONLYDIR);
        $paths = array_merge(['database/migrations'], $directories);
        $this->loadMigrationsFrom($paths);
    }
}
