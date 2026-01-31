<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use BelongsToCompany, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'doc_id',
        'phone',
        'email',
        'address',
        'notes',
        'status',
    ];

    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class);
    }
}
