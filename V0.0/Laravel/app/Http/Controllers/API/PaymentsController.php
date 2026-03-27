<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payments;
use Illuminate\Support\Facades\Validator;

class PaymentsController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Payments::query();

        if ($search) {
            $query->where('checkNumber', 'like', "%{$search}%")
                  ->orWhere('customerNumber', 'like', "%{$search}%");
        }

        $payments = $query->orderBy('customerNumber', 'asc')->paginate(10);
        return response()->json($payments);
    }

    public function destroy($customerNumber, $checkNumber){
        $payment = Payments::where('customerNumber', $customerNumber)
                          ->where('checkNumber', $checkNumber)
                          ->first();

        if (!$payment) {
            return response()->json(['message'=>"Data payment tidak ditemukan"], 404);
        }
        
        $payment->delete();
        return response()->json(['message'=>'data DIHANCURKAN'], 200);
    }

    public function show($checkNumber){
        $payment = Payments::find($checkNumber);

        if (!$payment) {
            return response()->json(['message'=>"Data payment tidak ditemukan"], 404);
        }
        return response()->json($payment, 200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'checkNumber' => 'required|string|max:50|unique:payments,checkNumber',
            'customerNumber' => 'required|string|max:10|exists:customers,customerNumber',
            'paymentDate' => 'required|date',
            'amount' => 'required|numeric|between:0,9999999.99'
        ]);

        $payment = Payments::create($validated);
        return response()->json($payment, 201);
    }

    public function update(Request $request, $checkNumber){
        $payment = Payments::find($checkNumber);

        if (!$payment) {
            return response()->json(['message'=>'Payment tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'customerNumber' => 'required|string|max:10|exists:customers,customerNumber',
            'paymentDate' => 'required|date',
            'amount' => 'required|numeric|between:0,9999999.99'
        ]);

        $payment->update($validated);
        return response()->json($payment, 200);
    }
}
