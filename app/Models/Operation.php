<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Operation extends Model
{
    use BelongsToCompany, SoftDeletes;

    protected $casts = [
        'performed_at' => 'datetime',
    ];

    protected $fillable = [
        'company_id',
        'client_id',
        'service_id',
        'operator_user_id',
        'amount',
        'status',
        'performed_at',
        'notes',
    ];

    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
