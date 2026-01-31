<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Company;
use App\Models\Operation;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::firstOrCreate(
            ['slug' => 'devoliq-demo'],
            [
                'name' => 'Devoliq',
                'plan' => 'pro',
                'status' => 'active',
            ]
        );

        $admin = User::firstOrCreate(
            ['company_id' => $company->id, 'email' => 'admin@devoliq.demo'],
            [
                'name' => 'Admin Devoliq',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        $operator1 = User::firstOrCreate(
            ['company_id' => $company->id, 'email' => 'op1@devoliq.demo'],
            [
                'name' => 'Operador María',
                'password' => Hash::make('password123'),
                'role' => 'operator',
            ]
        );

        $operator2 = User::firstOrCreate(
            ['company_id' => $company->id, 'email' => 'op2@devoliq.demo'],
            [
                'name' => 'Operador Carlos',
                'password' => Hash::make('password123'),
                'role' => 'operator',
            ]
        );

        $clientNames = [
            'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez',
            'Pedro Rodríguez', 'Laura Sánchez', 'Miguel Hernández', 'Elena Díaz',
            'Roberto Fernández', 'Isabel Gómez',
        ];

        $clients = [];
        foreach ($clientNames as $name) {
            $clients[] = Client::firstOrCreate(
                [
                    'company_id' => $company->id,
                    'email' => Str::slug($name, '') . '@demo.com',
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

        $existingOps = Operation::where('company_id', $company->id)->count();
        $toCreate = max(0, 30 - $existingOps);

        if ($toCreate === 0) {
            return;
        }

        $operators = [$admin, $operator1, $operator2];
        $now = now();

        for ($i = 0; $i < $toCreate; $i++) {
            $client = $clients[$i % count($clients)];
            $service = $services[$i % count($services)];
            $operator = $operators[$i % 3];
            $daysAgo = rand(0, 60);
            $performedAt = $now->copy()->subDays($daysAgo);

            Operation::create([
                'company_id' => $company->id,
                'client_id' => $client->id,
                'service_id' => $service->id,
                'operator_user_id' => $operator->id,
                'amount' => $service->price,
                'status' => 'done',
                'performed_at' => $performedAt,
            ]);
        }
    }
}
