<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orderdetails extends Model
{
    protected $table = 'orderdetails';
    protected $primaryKey = 'orderNumber';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'orderNumber',
        'productCode',
        'quantityOrdered',
        'orderLineNumber'
    ];

    protected $casts = [
        'priceEach' => 'decimal:2'
    ];
}
