<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $primaryKey = 'checkNumber';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customerNumber',
        'checkNumber',
        'paymentDate',
        'amount'
    ];

    protected $casts = [
        'paymentDate' => 'date',
        'amount' => 'decimal:2'
    ];
}
