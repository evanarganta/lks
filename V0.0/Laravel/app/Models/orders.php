<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    protected $primaryKey = 'orderNumber';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'orderNumber',
        'status',
        'comments',
        'customerNumber'
    ];

    protected $casts = [
        'orderDate' => 'date',
        'requiredDate' => 'date',
        'shippedDate' => 'date'
    ];
}
