<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\Validator;

class OrderDetailsController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = OrderDetails::query();

        if ($search) {
            $query->where('orderNumber', 'like', "%{$search}%")
                  ->orWhere('productCode', 'like', "%{$search}%");
        }

        $orderdetails = $query->orderBy('orderNumber', 'asc')->paginate(10);
        return response()->json($orderdetails);
    }

    public function destroy($customerNumber, $orderNumber){
        $orderdetails = OrderDetails::where('orderNumber', $orderNumber)
                          ->where('productCode', $productCode)
                          ->first();

        if (!$orderdetails) {
            return response()->json(['message'=>"Data order details tidak ditemukan"], 404);
        }
        
        $orderdetails->delete();
        return response()->json(['message'=>'data DIHANCURKAN'], 200);
    }

    public function show($orderNumber){
        $orderdetails = OrderDetails::find($orderNumber);

        if (!$orderdetails) {
            return response()->json(['message'=>"Data order details tidak ditemukan"], 404);
        }
        return response()->json($orderdetails, 200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'orderNumber' => 'required|string|max:11|unique:orderdetails,orderNumber',
            'productCode' => 'required|string|max:15|unique:orderdetails,productNumber',
            'quantityOrdered' => 'required|string|max:15',
            'priceEach' => 'required|numeric|between:0,9999999.99',
            'orderLineNumber' => 'required|string|max:6'
        ]);

        $orderdetails = OrderDetails::create($validated);
        return response()->json($orderdetails, 201);
    }

    public function update(Request $request, $orderNumber){
        $orderdetails = OrderDetails::find($checkNumber);

        if (!$orderdetails) {
            return response()->json(['message'=>'order details tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'orderNumber' => 'required|string|max:11|unique:orderdetails,orderNumber',
            'productCode' => 'required|string|max:15|unique:orderdetails,productNumber',
            'quantityOrdered' => 'required|string|max:15',
            'priceEach' => 'required|numeric|between:0,9999999.99',
            'orderLineNumber' => 'required|string|max:6'
        ]);

        $orderdetails->update($validated);
        return response()->json($orderdetails, 200);
    }
}
