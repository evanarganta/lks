<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\OfficeController;
use App\Http\Controllers\API\CustomersController;
use App\Http\Controllers\API\EmployeesController;
use App\Http\Controllers\API\PaymentsController;
use App\Http\Controllers\API\ProductLinesController;
use App\Http\Controllers\API\ProductsController;
use App\Http\Controllers\API\OrdersController;
use App\Http\Controllers\API\OrderDetailsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/office',[OfficeController::class, 'index']);
Route::get('/office/{officeCode}',[OfficeController::class, 'show']);
Route::delete('/office/{officeCode}',[OfficeController::class, 'destroy']);
Route::post('/office',[OfficeController::class, 'store']);
Route::put('/office/{officeCode}',[OfficeController::class, 'update']);

Route::get('/employees',[EmployeesController::class, 'index']);
Route::get('/employees/{employeeNumber}',[EmployeesController::class, 'show']);
Route::delete('/employees/{employeeNumber}',[EmployeesController::class, 'destroy']);
Route::post('/employees',[EmployeesController::class, 'store']);
Route::put('/employees/{employeeNumber}',[EmployeesController::class, 'update']);

Route::get('/customers/{customerNumber}',[CustomersController::class, 'show']);
Route::delete('/customers/{customerNumber}',[CustomersController::class, 'destroy']);
Route::get('/customers',[CustomersController::class, 'index']);
Route::post('/customers',[CustomersController::class, 'store']);
Route::put('/customers/{customerNumber}',[CustomersController::class, 'update']);

Route::get('/payments', [PaymentsController::class, 'index']);
Route::get('/payments/{checkNumber}', [PaymentsController::class, 'show']);
Route::post('/payments', [PaymentsController::class, 'store']);
Route::put('/payments/{checkNumber}', [PaymentsController::class, 'update']);
Route::delete('/payments/{checkNumber}', [PaymentsController::class, 'destroy']);

Route::get('/productlines', [ProductLinesController::class, 'index']);
Route::get('/productlines/{productLine}', [ProductLinesController::class, 'show']);
Route::post('/productlines', [ProductLinesController::class, 'store']);
Route::put('/productlines/{productLine}', [ProductLinesController::class, 'update']);
Route::delete('/productlines/{productLine}', [ProductLinesController::class, 'destroy']);

Route::get('/products', [ProductsController::class, 'index']);
Route::get('/products/{productCode}', [ProductsController::class, 'show']);
Route::post('/products', [ProductsController::class, 'store']);
Route::put('/products/{productCode}', [ProductsController::class, 'update']);
Route::delete('/products/{productCode}', [ProductsController::class, 'destroy']);

Route::get('/orders', [OrdersController::class, 'index']);
Route::get('/orders/{orderNumber}', [OrdersController::class, 'show']);
Route::post('/orders', [OrdersController::class, 'store']);
Route::put('/orders/{orderNumber}', [OrdersController::class, 'update']);
Route::delete('orders/{orderNumber}', [OrdersController::class, 'destroy']);

Route::get('/orderdetails', [OrderDetailsController::class, 'index']);
Route::get('/orderdetails/{orderNumber}', [OrderDetailsController::class, 'show']);
Route::post('/orderdetails', [OrderDetailsController::class, 'store']);
Route::put('/orderdetails/{orderNumber}', [OrderDetailsController::class, 'update']);
Route::delete('orderdetails/{orderNumber}', [OrderDetailsController::class, 'destroy']);
