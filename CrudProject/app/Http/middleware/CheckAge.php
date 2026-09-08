<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAge
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->age < 18) {
            return response()->json([
                'message' => 'You must be 18 or older'
            ], 403);
        }

        return $next($request);
    }
}