<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\RequireRole::class,
            'plan' => \App\Http\Middleware\EnforcePlanLimits::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if ($e->getStatusCode() === 403 && ! $request->expectsJson()) {
                return \Inertia\Inertia::render('Errors/Forbidden')
                    ->toResponse($request)
                    ->setStatusCode(403);
            }

            return null;
        });
    })->create();
