<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        $student = Student::all();
        \Log::info("Hello namaste");
        \Log::warning("asdfg");
        \Log::error($e);
        \Log::error($e->getMessage());
        \Log::debug($e);
        \Log::debug($request->all());
        \Log::critical("Hmm DB Is Down");
        return response()->json([
            "success" => true,
            "message" => "List of students",
            "data" => $student,
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email|unique:students,email",
                "age" => "required|integer",
                "file" => "required|file|max:5000|mimes:pdf,doc,docx"
            ]);

            // $file_name_with_ext = $request->file('file')->store('documents', 'public');

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '.' . $file->getClientOriginalExtension();
                $file->move('uploads', $fileName);
                $file_name_with_ext = $fileName;
            } else {
                $file_name_with_ext = null;
            }


            $student = Student::create([
                "name" => $request->name,
                "email" => $request->email,
                "age" => $request->age,
                'file' => $file_name_with_ext,
            ]);

            return response()->json([
                "status" => true,
                "message" => "Student Created",
                "data" => $student,
            ]);


        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function show($id)
    {
        try {
            $student = Student::find($id);
            if (!$student) {
                return response()->json([
                    "status" => false,
                    "message" => "Student not found."
                ]);
            }

            return response()->json([
                "status" => true,
                "message" => "success",
                "data" => $student,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                "status" => false,
                "message" => $e->getMessage()
            ], 500);
        }

    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!student) {
            return response()->json([
                "success" => false,
                "message" => "Student Not Found",
            ]);
        }

        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:students,email," . $id,
            "age" => "required|integer",
        ]);

        $student->update([
            "name" => $request->name,
            "email" => $request->email,
            "age" => $request->age,
        ]);

        return response()->json([
            "success" => true,
            "message" => "Student Data Updated Successfully",
        ]);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json([
                "success" => false,
                "message" => "Student not found",
            ]);
        }

        $student->delete();
        return response()->json([
            "success" => true,
            "message" => "Student deleted successfully"
        ]);

    }


}
