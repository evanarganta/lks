<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Office;
use Illuminate\Support\Facades\Validator;

class OfficeController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Office::query();

        if ($search) {
            $query->where('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('officeCode', 'like', "%{$search}%");
        }

        $office = $query->orderBy('officeCode', 'asc')->paginate(10);
        return response()->json($office);
    }

    public function destroy($officeCode){
        $office = Office::find($officeCode);

        if (!$officeCode) {
            return response()->json(['message'=>"Data office tidak ditemukan"], 404);
        } else {
            $office->delete();
            return response()->json(['message'=>'data DIHANCURKAN'],200);
        }
    }

    public function show($officeCode){
        $office = Office::find($officeCode);

        if (!$office) {
            return response()->json(['message'=>"Data office tidak ditemukan"], 404);
        }
            return response()->json([$office],200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'officeCode'=>'required|string|max:10|unique:offices,officeCode',
            'city'=>'required|string|max:50',
            'phone'=>'required|string|max:50',
            'addressLine1'=>'required|string|max:50',
            'addressLine2'=>'required|string|max:50',
            'state'=>'required|string|max:50',
            'country'=>'required|string|max:50',
            'postalCode'=>'required|string|max:15',
            'territory'=>'required|string|max:10'
        ]);

        $office = Office::create($validated);
        return response()->json($office, 201);
    }

    public function update(Request $request, $officeCode){
        $office = Office::find($officeCode);

        if (!$office) {
            return response()->json(['message'=>'Office tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'city'=>'required|string|max:50',
            'phone'=>'required|string|max:50',
            'addressLine1'=>'required|string|max:50',
            'addressLine2'=>'required|string|max:50',
            'country'=>'required|string|max:50',
            'postalCode'=>'required|string|max:15',
            'territory'=>'required|string|max:10'
        ]);

        $office->update($validated);
        return response()->json($office, 200);
    }
}
