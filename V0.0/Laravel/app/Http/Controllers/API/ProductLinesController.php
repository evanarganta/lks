<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductLines;
use Illuminate\Support\Facades\Validator;

class ProductLinesController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = ProductLines::query();

        if ($search) {
            $query->where('productLine', 'like', "%{$search}%")
                  ->orWhere('textDescription', 'like', "%{$search}%");
        }

        $productlines = $query->orderBy('productLine', 'asc')->paginate(10);
        return response()->json($productlines);
    }

    public function destroy($productLine){
        $productlines = ProductLines::find($productLine);

        if (!$productLine) {
            return response()->json(['message'=>"Data product line tidak ditemukan"], 404);
        } else {
            $productlines->delete();
            return response()->json(['message'=>'data DIHANCURKAN'],200);
        }
    }

    public function show($productLine){
        $productlines = ProductLines::find($productLine);

        if (!$productlines) {
            return response()->json(['message'=>"Data product line tidak ditemukan"], 404);
        }
            return response()->json([$productlines],200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'productLine' => 'required|string|max:50|unique:productlines,productLine',
            'textDescription' => 'nullable|string|max:4000',
            'htmlDescription' => 'required|string',
            'image' => 'required|file|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        $productlines = ProductLines::create($validated);
        return response()->json($productlines, 201);
    }

    public function update(Request $request, $productLine){
        $productlines = ProductLines::find($productLine);

        if (!$productlines) {
            return response()->json(['message'=>'Product line tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'productLine' => 'required|string|max:50|unique:productlines,productLine',
            'textDescription' => 'nullable|string|max:50',
            'htmlDescription' => 'required|string',
            'image' => 'required|file|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        $productlines->update($validated);
        return response()->json($productlines, 200);
    }
}
