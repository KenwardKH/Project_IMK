<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Check if user has required role
        if (!in_array($user->role, $roles)) {
            // Redirect based on user's actual role
            return $this->redirectBasedOnRole($user->role);
        }

        return $next($request);
    }

    /**
     * Redirect user based on their role
     */
    private function redirectBasedOnRole(string $role): Response
    {
        switch ($role) {
            case 'customer':
                return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
            case 'cashier':
                return redirect()->route('cashier.index')->with('error', 'You do not have permission to access this page.');
            case 'owner':
                return redirect()->route('owner-dashboard')->with('error', 'You do not have permission to access this page.');
            default:
                return redirect()->route('login')->with('error', 'Invalid user role.');
        }
    }
}