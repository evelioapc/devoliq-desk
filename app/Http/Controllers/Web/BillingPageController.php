<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Operation;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

class BillingPageController extends Controller
{
    public function __invoke(): Response
    {
        $company = request()->user()?->company;
        $plan = $company?->plan ?? 'free';

        $clientsCount = Client::count();
        $opsThisMonth = Operation::query()
            ->whereBetween('performed_at', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth(),
            ])
            ->count();

        $limits = config('plans.limits', [
            'free' => ['clients' => 50, 'ops_per_month' => 200],
            'pro' => ['clients' => null, 'ops_per_month' => null],
        ]);

        $usage = [
            'clients' => $clientsCount,
            'clients_limit' => $limits[$plan]['clients'],
            'ops_this_month' => $opsThisMonth,
            'ops_limit' => $limits[$plan]['ops_per_month'],
        ];

        return Inertia::render('Billing/Index', [
            'usage' => $usage,
            'limits' => $limits,
        ]);
    }
}
