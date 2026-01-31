<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Operation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BillingController extends Controller
{
    public function usage(Request $request)
    {
        $company = $request->user()->company;
        $plan = $company->plan ?? 'free';
        $limits = config('plans.limits', []);
        $planLimits = $limits[$plan] ?? $limits['free'] ?? [];

        $clientsCount = Client::count();
        $opsThisMonth = Operation::query()
            ->whereBetween('performed_at', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth(),
            ])
            ->count();

        return response()->json([
            'usage' => [
                'clients' => $clientsCount,
                'clients_limit' => $planLimits['clients'] ?? null,
                'ops_this_month' => $opsThisMonth,
                'ops_limit' => $planLimits['ops_per_month'] ?? null,
            ],
            'limits' => $limits,
        ]);
    }

    public function setPlan(Request $request)
    {
        $data = $request->validate([
            'plan' => ['required', 'in:free,pro'],
        ]);

        $company = $request->user()->company;
        $company->update(['plan' => $data['plan']]);
        log_activity('plan_changed', $company, ['plan' => $company->plan]);

        return response()->json(['company' => $company]);
    }
}
