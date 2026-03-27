<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductLines extends Model
{
    protected $table = 'productlines';
    protected $primaryKey ='productLine';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable =['productLine', 'textDescription', 'htmlDescription', 'image'];
}
