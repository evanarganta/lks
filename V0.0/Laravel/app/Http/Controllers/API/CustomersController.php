<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\Validator;

class CustomersController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Customers::query();

        if ($search){
            $query->where('customerName', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('customerNumber', 'like', "%{$search}%");
        }

        $customers = $query->orderBy('customerNumber', 'asc')->paginate(10);
        return response()->json($customers);
    }

    public function destroy($customerNumber){
        $customer = Customers::find($customerNumber);

        if (!$customer) {
            return response()->json(['message'=>"Data customer tidak ditemukan"], 404);
        } else {
            $customer->delete();
            return response()->json(['message'=>'data DIHANCURKAN'],200);
        }
    }

    public function show($customerNumber){
        $customer = Customers::find($customerNumber);

        if (!$customer) {
            return response()->json(['message'=>"Data customer tidak ditemukan"], 404);
        }

        return response()->json($customer,200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'customerNumber' => 'required|string|max:10|unique:customers,customerNumber',
            'customerName' => 'required|string|max:50',
            'contactLastName' => 'required|string|max:50',
            'contactFirstName' => 'required|string|max:50',
            'addressLine1' => 'nullable|string|max:50',
            'addressLine2' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:50',
            'postalCode' => 'required|string|max:15',
            'country' => 'nullable|string|max:50',
            'salesRepEmployeeNumber' => 'required|string|max:15',
            'creditLimit' => 'required|string|max:50',
        ]);

        $customer = Customers::create($validated);
        return response()->json($customer, 201);
    }

    public function update(Request $request, $customerNumber){
        $customer = Customers::find($customerNumber);

        if (!$customer) {
            return response()->json(['message'=>'Customer tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'customerName' => 'required|string|max:50',
            'contactLastName' => 'required|string|max:50',
            'contactFirstName' => 'required|string|max:50',
            'addressLine1' => 'nullable|string|max:50',
            'addressLine2' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:50',
            'postalCode' => 'required|string|max:15',
            'country' => 'nullable|string|max:50',
            'salesRepEmployeeNumber' => 'required|string|max:15',
            'creditLimit' => 'required|string|max:50',
        ]);

        $customer->update($validated);
        return response()->json($customer, 200);
    }

}
