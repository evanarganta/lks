<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class products extends Model
{
    protected $primaryKey = 'productCode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'productCode',
        'productLine',
        'productScale',
        'productVendor',
        'productDescription',
        'quantityInStock'
    ];

    protected $casts = [
        'buyPrice' => 'decimal:2',
        'MSRP' => 'decimal:2',
    ];
}
