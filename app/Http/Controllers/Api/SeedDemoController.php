<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Operation;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SeedDemoController extends Controller
{
    /**
     * Seed demo data for the current user's company. Only available when APP_ENV=local.
     */
    public function __invoke(Request $request): JsonResponse
    {
        if (! app()->isLocal()) {
            abort(404);
        }

        $user = $request->user();
        $company = $user?->company;
        if (! $company) {
            return response()->json(['message' => 'No company found'], 422);
        }

        $clientNames = [
            'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez',
            'Pedro Rodríguez', 'Laura Sánchez', 'Miguel Hernández', 'Elena Díaz',
            'Roberto Fernández', 'Isabel Gómez',
        ];

        foreach ($clientNames as $name) {
            Client::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'email' => Str::slug($name, '').'@demo.'.$company->id.'.local',
                ],
                [
                    'name' => $name,
                    'status' => 'active',
                ]
            );
        }

        $serviceData = [
            ['name' => 'Reparación básica', 'price' => 50000, 'duration' => 60],
            ['name' => 'Reparación premium', 'price' => 120000, 'duration' => 120],
            ['name' => 'Mantenimiento', 'price' => 35000, 'duration' => 45],
            ['name' => 'Diagnóstico', 'price' => 25000, 'duration' => 30],
            ['name' => 'Instalación', 'price' => 80000, 'duration' => 90],
        ];

        $services = [];
        foreach ($serviceData as $svc) {
            $services[] = Service::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'name' => $svc['name'],
                ],
                [
                    'price' => $svc['price'],
                    'duration_minutes' => $svc['duration'],
                    'status' => 'active',
                ]
            );
        }

        $clients = Client::where('company_id', $company->id)->get();
        $existingOps = Operation::where('company_id', $company->id)->count();
        $toCreate = max(0, 30 - $existingOps);

        for ($i = 0; $i < $toCreate; $i++) {
            $client = $clients[$i % $clients->count()];
            $service = $services[$i % count($services)];
            $daysAgo = rand(0, 60);

            Operation::create([
                'company_id' => $company->id,
                'client_id' => $client->id,
                'service_id' => $service->id,
                'operator_user_id' => $user->id,
                'amount' => $service->price,
                'status' => 'done',
                'performed_at' => now()->subDays($daysAgo),
            ]);
        }

        return response()->json([
            'message' => 'Demo data loaded successfully',
            'clients' => $clients->count(),
            'services' => count($services),
            'operations_added' => $toCreate,
        ]);
    }
}
