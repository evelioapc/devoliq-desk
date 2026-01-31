<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;
        $q = $request->query('q');
        $search = strtolower((string) $q);

        $users = User::query()
            ->where('company_id', $companyId)
            ->when($q, fn ($qq) => $qq->where(function ($q2) use ($search) {
                $q2->whereRaw('LOWER(name) LIKE ?', ['%'.$search.'%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%'.$search.'%']);
            }))
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json($users);
    }

    public function store(StoreUserRequest $request)
    {
        $admin = $request->user();

        $user = User::create([
            'company_id' => $admin->company_id,
            'name' => $request->validated()['name'],
            'email' => $request->validated()['email'],
            'password' => Hash::make($request->validated()['password']),
            'role' => $request->validated()['role'],
        ]);

        return response()->json($user, 201);
    }

    public function show(Request $request, User $user)
    {
        if ($user->company_id !== $request->user()->company_id) {
            abort(404);
        }

        return response()->json($user);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        if ($user->company_id !== $request->user()->company_id) {
            abort(404);
        }

        $data = $request->validated();

        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->company_id !== $request->user()->company_id) {
            abort(404);
        }

        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'No puedes eliminar tu propio usuario'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'OK']);
    }
}
