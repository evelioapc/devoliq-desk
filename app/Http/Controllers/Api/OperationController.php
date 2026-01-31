<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOperationRequest;
use App\Models\Operation;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $ops = Operation::query()
            ->with(['client:id,name', 'service:id,name'])
            ->when($from, fn ($q) => $q->whereDate('performed_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('performed_at', '<=', $to))
            ->orderByDesc('performed_at')
            ->paginate(20);

        return response()->json($ops);
    }

    public function store(StoreOperationRequest $request)
    {
        $user = $request->user();

        $op = Operation::create([
            ...$request->validated(),
            'operator_user_id' => $user->id,
        ]);
        log_activity('created', $op, ['amount' => $op->amount]);

        return response()->json($op, 201);
    }

    public function show(Operation $operation)
    {
        $operation->load(['client:id,name,email', 'service:id,name,price']);
        return response()->json($operation);
    }

    public function destroy(Operation $operation)
    {
        log_activity('deleted', $operation);
        $operation->delete();

        return response()->json(['message' => 'OK']);
    }

    public function restore(int $id)
    {
        $operation = Operation::withTrashed()->findOrFail($id);
        $operation->restore();

        return response()->json($operation);
    }
}
