<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $q = strtolower((string) $request->query('q', ''));

        $services = Service::query()
            ->when($q !== '', fn ($qq) => $qq->whereRaw('LOWER(name) LIKE ?', ['%'.$q.'%']))
            ->orderByDesc('id')
            ->paginate((int) $request->query('per_page', 20));

        return response()->json($services);
    }

    public function store(StoreServiceRequest $request)
    {
        $service = Service::create($request->validated());
        log_activity('created', $service);

        return response()->json($service, 201);
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());
        log_activity('updated', $service, ['changes' => $service->getChanges()]);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        log_activity('deleted', $service);
        $service->delete();

        return response()->json(['message' => 'OK']);
    }

    public function restore(int $id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->restore();

        return response()->json($service);
    }
}
