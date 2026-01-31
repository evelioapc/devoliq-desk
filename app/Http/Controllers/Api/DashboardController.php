<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Operation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from'))->startOfDay() : now()->startOfMonth();
        $to = $request->query('to') ? Carbon::parse($request->query('to'))->endOfDay() : now()->endOfDay();

        $opsQuery = Operation::query()->whereBetween('performed_at', [$from, $to]);

        $opsCount = (clone $opsQuery)->count();
        $revenue = (clone $opsQuery)->sum('amount');

        $clientsNew = Client::query()
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $topServices = (clone $opsQuery)
            ->selectRaw('service_id, COUNT(*) as total')
            ->groupBy('service_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json([
            'range' => ['from' => $from->toISOString(), 'to' => $to->toISOString()],
            'ops_count' => $opsCount,
            'revenue' => (float) $revenue,
            'clients_new' => $clientsNew,
            'top_services' => $topServices,
        ]);
    }
}
