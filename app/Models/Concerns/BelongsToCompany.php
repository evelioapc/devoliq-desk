<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            $user = Auth::user();
            if ($user && $user->company_id) {
                $builder->where($builder->getModel()->getTable().'.company_id', $user->company_id);
            }
        });

        static::creating(function ($model) {
            $user = Auth::user();
            if ($user && $user->company_id && empty($model->company_id)) {
                $model->company_id = $user->company_id;
            }
        });
    }
}
