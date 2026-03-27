<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employees extends Model
{
    protected $primaryKey ='employeeNumber';
    public $incrementing = true;
    protected $keyType = 'string';

    protected $fillable =['employeeNumber', 'lastName', 'firstName', 'extension', 'email', 'officeCode', 'reportsTo', 'jobTitle'];
}
