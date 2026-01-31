<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $q = strtolower((string) $request->query('q', ''));

        $clients = Client::query()
            ->when($q !== '', fn ($qq) => $qq->where(function ($q2) use ($q) {
                $q2->whereRaw('LOWER(name) LIKE ?', ['%'.$q.'%'])
                    ->orWhereRaw('LOWER(doc_id) LIKE ?', ['%'.$q.'%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%'.$q.'%']);
            }))
            ->orderByDesc('id')
            ->paginate((int) $request->query('per_page', 20));

        return response()->json($clients);
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());
        log_activity('created', $client);

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());
        log_activity('updated', $client, ['changes' => $client->getChanges()]);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        log_activity('deleted', $client);
        $client->delete();

        return response()->json(['message' => 'OK']);
    }

    public function restore(int $id)
    {
        $client = Client::withTrashed()->findOrFail($id);
        $client->restore();

        return response()->json($client);
    }
}
