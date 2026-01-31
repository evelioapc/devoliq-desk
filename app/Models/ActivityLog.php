<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use BelongsToCompany;

    protected $fillable = [
        'company_id',
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
