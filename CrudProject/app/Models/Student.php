<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    protected $guarded = ['id'];
    protected $fillable = [
        'name',
        'email',
        'age',
    ];


    // $table->string('email')->unique();
    // $table->string('name')->nullable();
    // $table->integer('age')->default(18);
    // $table->string('phone')->nullable();
    // $table->softDeletes();

    // $table->enum('status', ['active', 'inactive', 'pending']);

    // $table->id();
    // $table->string('name');
    // $table->string('email')->unique();
    // $table->text('description');
    // $table->integer('age');
    // $table->boolean('is_active');
    // $table->decimal('salary', 10, 2);
    // $table->date('dob');
    // $table->dateTime('joining_date');
    // $table->timestamps();

    // $table->index(['name', 'age']);

    protected $table = 'student_details';
    protected $primaryKey = 'student_id';

    public $timestamps = false;

    protected $hidden = [
        'password',
        'remember_token'
    ];



    // default values
    protected $attributes = [
        'status' => 'Active'
    ];

    // automatic convert of data types
    protected $casts = [
        'age' => 'integer',
        'created_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
        return $this->hasMany(Book::class);

        // Many Students belong to one College.
        return $this->belongsTo(College::class);

        // Students ↔ Courses - Many-to-Many
        return $this->belongsToMany(Course::class);

    }


    //  $college = College::with('students')->findOrFail($college_id);


    public function college()
    {
        return $this->belongsTo(College::class, 'college_id', 'college_id');
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'student_course', 'student_id', 'course_id');
    }


    use SoftDeletes;
}
