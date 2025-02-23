<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class OptionalAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        Auth::shouldUse('web');
        return $next($request);
    }
}
