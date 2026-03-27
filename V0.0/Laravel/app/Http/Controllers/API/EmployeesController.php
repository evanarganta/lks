<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employees;
use Illuminate\Support\Facades\Validator;

class EmployeesController extends Controller
{
    public function index(Request $request) {
        $search = $request->query('search');
        $query = Employees::query();

        if ($search) {
            $query->where('firstName', 'like', "%{$search}%")
                  ->orWhere('extension', 'like', "%{$search}%")
                  ->orWhere('employeeNumber', 'like', "%{$search}%");
        }

        $employees = $query->orderBy('employeeNumber', 'asc')->paginate(10);
        return response()->json($employees);
    }

    public function destroy($employeeNumber){
        $employees = Employees::find($employeeNumber);

        if (!$employeeNumber) {
            return response()->json(['message'=>"Data employee tidak ditemukan"], 404);
        } else {
            $employees->delete();
            return response()->json(['message'=>'data DIHANCURKAN'],200);
        }
    }

    public function show($employeeNumber){
        $employees = Employees::find($employeeNumber);

        if (!$employees) {
            return response()->json(['message'=>"Data employee tidak ditemukan"], 404);
        }
            return response()->json([$employees],200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'employeeNumber' => 'required|string|max:11|unique:employees,employeeNumber',
            'lastName' => 'nullable|string|max:50',
            'firstName' => 'required|string|max:50',
            'extension' => 'required|string|max:50',
            'email' => 'required|string|max:50',
            'officeCode' => 'required|string|max:10|exists:offices,officeCode',
            'reportsTo' => 'nullable|string|max:11|exists:employees,employeeNumber',
            'jobTitle' => 'required|string|max:50'
        ]);

        $employee = Employees::create($validated);
        return response()->json($employee, 201);
    }

    public function update(Request $request, $employeeNumber){
        $employee = Employees::find($employeeNumber);

        if (!$employee) {
            return response()->json(['message'=>'Employee tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'lastName' => 'nullable|string|max:50',
            'firstName' => 'required|string|max:50',
            'extension' => 'required|string|max:50',
            'email' => 'required|string|max:50',
            'officeCode' => 'required|string|max:10|exists:offices,officeCode',
            'reportsTo' => 'nullable|string|max:11|exists:employees,employeeNumber',
            'jobTitle' => 'required|string|max:50'
        ]);

        $employee->update($validated);
        return response()->json($employee, 200);
    }
}
