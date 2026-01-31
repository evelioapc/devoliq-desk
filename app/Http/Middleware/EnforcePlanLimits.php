<?php

namespace App\Http\Middleware;

use App\Models\Client;
use App\Models\Operation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforcePlanLimits
{
    public function handle(Request $request, Closure $next, string $action): Response
    {
        $user = $request->user();
        $company = $user?->company;

        if (! $user || ! $company) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($company->plan === 'pro') {
            return $next($request);
        }

        $limits = config('plans.limits.free', []);
        $maxClients = $limits['clients'] ?? 50;
        $maxOpsPerMonth = $limits['ops_per_month'] ?? 200;

        if ($action === 'create-client') {
            $count = Client::count();
            if ($count >= $maxClients) {
                return response()->json([
                    'message' => 'Límite del plan Free alcanzado (clientes).',
                    'limit' => $maxClients,
                    'plan' => $company->plan,
                    'upgrade' => true,
                ], 402);
            }
        }

        if ($action === 'create-operation') {
            $from = now()->startOfMonth();
            $to = now()->endOfMonth();

            $count = Operation::whereBetween('performed_at', [$from, $to])->count();

            if ($count >= $maxOpsPerMonth) {
                return response()->json([
                    'message' => 'Límite del plan Free alcanzado (operaciones mensuales).',
                    'limit' => $maxOpsPerMonth,
                    'plan' => $company->plan,
                    'upgrade' => true,
                ], 402);
            }
        }

        return $next($request);
    }
}
