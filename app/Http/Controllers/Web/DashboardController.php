<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Operation;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $period = $request->query('period', '30');
        $days = match ($period) {
            '7' => 7,
            '90' => 90,
            default => 30,
        };

        $to = now()->endOfDay();
        $from = now()->subDays($days)->startOfDay();

        $opsQuery = Operation::query()->whereBetween('performed_at', [$from, $to]);

        $summary = [
            'period' => $period,
            'range' => ['from' => $from->toISOString(), 'to' => $to->toISOString()],
            'ops_count' => (clone $opsQuery)->count(),
            'revenue' => (float) (clone $opsQuery)->sum('amount'),
            'clients_new' => Client::query()->whereBetween('created_at', [$from, $to])->count(),
        ];

        $topServices = (clone $opsQuery)
            ->join('services', 'operations.service_id', '=', 'services.id')
            ->selectRaw('services.id, services.name, COUNT(*) as ops_count, SUM(operations.amount) as revenue')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'name' => $row->name,
                'ops_count' => (int) $row->ops_count,
                'revenue' => (float) $row->revenue,
            ]);

        $latestOps = Operation::query()
            ->with(['client:id,name', 'service:id,name'])
            ->orderByDesc('performed_at')
            ->limit(8)
            ->get()
            ->map(fn ($op) => [
                'id' => $op->id,
                'client' => $op->client?->name ?? '-',
                'service' => $op->service?->name ?? '-',
                'amount' => (float) $op->amount,
                'performed_at' => $op->performed_at?->toISOString(),
            ]);

        return Inertia::render('Dashboard', [
            'summary' => $summary,
            'topServices' => $topServices,
            'latestOperations' => $latestOps,
        ]);
    }
}
