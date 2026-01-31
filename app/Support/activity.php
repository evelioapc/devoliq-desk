<?php

use App\Models\ActivityLog;

if (! function_exists('log_activity')) {
    function log_activity(string $action, $entity = null, array $meta = [], $user = null): void
    {
        $user = $user ?? auth()->user();
        $companyId = $user?->company_id;

        if (! $companyId) {
            return;
        }

        if ($entity && isset($entity->name) && ! isset($meta['entity_name'])) {
            $meta['entity_name'] = $entity->name;
        }
        if ($entity && isset($entity->plan) && $action === 'plan_changed') {
            $meta['entity_name'] = 'Plan ' . $entity->plan;
        }

        ActivityLog::create([
            'company_id' => $companyId,
            'user_id' => $user?->id,
            'action' => $action,
            'entity_type' => $entity ? class_basename($entity) : null,
            'entity_id' => $entity?->id,
            'meta' => $meta ?: null,
        ]);
    }
}
