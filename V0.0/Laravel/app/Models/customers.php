<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class customers extends Model
{
    protected $primaryKey ='customerNumber';
    public $incrementing = true;
    protected $keyType = 'string';

    protected $fillable =['customerNumber', 'customerName', 'contactLastName', 'contactFirstName', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country', 'salesRepEmployeeNumber', 'creditLimit'];
}
