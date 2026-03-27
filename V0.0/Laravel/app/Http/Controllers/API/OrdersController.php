<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orders;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Orders::query();

        if ($search) {
            $query->where('orderNumber', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
        }

        $orders = $query->orderBy('orderNumber', 'asc')->paginate(10);
        return response()->json($orders);
    }

    public function destroy($orderNumber){
        $orders = Orders::find($orderNumber);

        if (!$orders) {
            return response()->json(['message'=>"Data order tidak ditemukan"], 404);
        }

        $orders->delete();
        return response()->json(['message'=>'data DIHANCURKAN'], 200);
    }

    public function show($orderNumber){
        $orders = Orders::find($orderNumber);

        if (!$orders) {
            return response()->json(['message'=>"Data order tidak ditemukan"], 404);
        }
        return response()->json($orders, 200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'orderNumber' => 'required|string|max:11|unique:orders,orderNumber',
            'orderDate' => 'required|date',
            'requiredDate' => 'required|date',
            'shippedDate' => 'required|date',
            'status' => 'required|string|max:15',
            'comments' => 'required|string|max:4000',
            'customerNumber' => 'required|string|max:11|exists:customers,customerNumber'
        ]);

        $orders = Orders::create($validated);
        return response()->json($orders, 201);
    }

    public function update(Request $request, $orderNumber){
        $orders = Orders::find($orderNumber);

        if (!$orders) {
            return response()->json(['message'=>'order tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'orderNumber' => 'required|string|max:11|unique:orders,orderNumber',
            'orderDate' => 'required|date',
            'requiredDate' => 'required|date',
            'shippedDate' => 'required|date',
            'status' => 'required|string|max:15',
            'comments' => 'required|string|max:4000',
            'customerNumber' => 'required|string|max:11|exists:customers,customerNumber'
        ]);

        $orders->update($validated);
        return response()->json($orders, 200);
    }
}
