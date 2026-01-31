<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Operation;
use App\Models\Service;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    protected function resolveEntityName(?string $entityType, ?int $entityId): ?string
    {
        if (! $entityType || ! $entityId) {
            return null;
        }
        $model = match ($entityType) {
            'Client' => Client::withTrashed()->find($entityId),
            'Service' => Service::withTrashed()->find($entityId),
            'Operation' => Operation::withTrashed()->with('client:id,name')->find($entityId),
            default => null,
        };

        if ($entityType === 'Operation' && $model) {
            return ($model->client?->name ?? 'Cliente') . ' - $' . number_format($model->amount);
        }

        return $model?->name ?? null;
    }

    protected function entityRoute(?string $entityType, ?int $entityId): ?string
    {
        if (! $entityType || ! $entityId) {
            return null;
        }

        return match ($entityType) {
            'Client' => "/clients",
            'Service' => "/services",
            'Operation' => "/operations",
            default => null,
        };
    }

    protected function buildDescription(ActivityLog $log): string
    {
        $userName = $log->user?->name ?? 'Sistema';
        $entityName = $log->meta['entity_name'] ?? $this->resolveEntityName($log->entity_type, $log->entity_id) ?? $log->entity_type . ' #' . $log->entity_id;

        $action = match ($log->action) {
            'created' => 'creó',
            'updated' => 'actualizó',
            'deleted' => 'eliminó',
            'plan_changed' => 'cambió a',
            'login' => 'inició sesión',
            default => $log->action,
        };

        if ($log->action === 'login') {
            return "{$userName} {$action}";
        }
        if ($log->action === 'plan_changed') {
            return "{$userName} {$action} {$entityName}";
        }

        $entityLabel = match ($log->entity_type) {
            'Client' => 'Cliente',
            'Service' => 'Servicio',
            'Operation' => 'Operación',
            default => $log->entity_type ?? 'registro',
        };

        return "{$userName} {$action} {$entityLabel} {$entityName}";
    }

    public function index(Request $request)
    {
        $entityType = $request->query('entity_type');
        $entityId = $request->query('entity_id');

        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->when($entityType, fn ($q) => $q->where('entity_type', $entityType))
            ->when($entityId, fn ($q) => $q->where('entity_id', $entityId))
            ->orderByDesc('id')
            ->paginate(30);

        $logs->getCollection()->transform(function (ActivityLog $log) {
            return [
                'id' => $log->id,
                'user' => $log->user,
                'description' => $this->buildDescription($log),
                'action' => $log->action,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'route' => $this->entityRoute($log->entity_type, $log->entity_id),
                'created_at' => $log->created_at?->toISOString(),
            ];
        });

        return response()->json($logs);
    }
}
