<?php

use App\Models\Student;
use Illuminate\Http\Request;

class StudentControllerWeb extends Controller{
    public function index(){
        $student = Student::all();
        return view('student', compact('students'));
    }

    public function create(Request $request){
        try{
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|unique:students,email',
                'age' => 'required|integer',
            ]);

            $student = Student::create([
                "name" => $request->name,
                "email" => $request->email,
                "age" => $request->age,
            ]);

            // return response()->json([
            //     "status" => true,
            //     "message" => "Student Created",
            //     "date" => $student,
            // ]);

            return redirect()->route('students.index')->with('success', "Student Created Successfully");

        }catch(\Exception $e){
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function show($id){
        try {
            $student = Student::find($id);
            return view('student', compact('student'));
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->message,
            ]);
        }
    }

    public function update(Request $request, $id){

        $request->validate([
            'name' => 'nullable|max:255|string',
            'email' => 'nullable|email|unique: students, email' . $id,
            'age' => 'nullable|integer'
        ]);

        $student_old = Student::findOrFail($id);

        $student = Student::update([
            'name' => $request->name ?? $student_old->name,
            'email' => $request->email ?? $student_old->email,
            'age' => $request->age ?? $student_old->age,
        ]);

        return redirect()->route('students.index')->with('success', "Updated Successfully");

    }

    public function destroy($id){
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->route('students.index')->with('success', "Deleted Successfully");
    }

}