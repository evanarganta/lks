<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Validator;

class ProductsController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Products::query();

        if ($search) {
            $query->where('productCode', 'like', "%{$search}%")
                  ->orWhere('productName', 'like', "%{$search}%");
        }

        $products = $query->orderBy('productCode', 'asc')->paginate(10);
        return response()->json($products);
    }

    public function destroy($productCode){
        $products = Products::find($productCode);

        if (!$products) {
            return response()->json(['message'=>"Data product tidak ditemukan"], 404);
        }
        
        $products->delete();
        return response()->json(['message'=>'data DIHANCURKAN'], 200);
    }

    public function show($productCode){
        $products = Products::find($productCode);

        if (!$products) {
            return response()->json(['message'=>"Data product tidak ditemukan"], 404);
        }
        return response()->json($products, 200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'productCode' => 'required|string|max:50|unique:products,productCode',
            'productName' => 'required|string|max:70',
            'productLine' => 'required|string|max:50|exists:productlines,productLine',
            'productScale' => 'required|string|max:10',
            'productVendor' => 'required|string|max:50',
            'productDescription' => 'required|string|max:4000',
            'quantityInStock' => 'required|string|max:6',
            'buyPrice' => 'required|numeric|between:0,9999999.99',
            'MSRP' => 'required|numeric|between:0,9999999.99'
        ]);

        $products = Products::create($validated);
        return response()->json($products, 201);
    }

    public function update(Request $request, $productCode){
        $products = Products::find($productCode);

        if (!$products) {
            return response()->json(['message'=>'product tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'productCode' => 'required|string|max:50|unique:products,productCode',
            'productName' => 'required|string|max:70',
            'productLine' => 'required|string|max:50|exists:productlines,productLine',
            'productScale' => 'required|string|max:10',
            'productVendor' => 'required|string|max:50',
            'productDescription' => 'required|string|max:4000',
            'quantityInStock' => 'required|string|max:6',
            'buyPrice' => 'required|numeric|between:0,9999999.99',
            'MSRP' => 'required|numeric|between:0,9999999.99'
        ]);

        $products->update($validated);
        return response()->json($products, 200);
    }
}
