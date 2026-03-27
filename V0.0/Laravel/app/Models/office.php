<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $primaryKey = 'officeCode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['officeCode', 'city', 'phone', 'addressLine1', 'addressLine2', 'country', 'postalCode', 'territory'];

    public function employees()
    {
        return $this->hasMany(Employees::class, 'officeCode', 'officeCode');
    }
}
