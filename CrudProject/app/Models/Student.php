<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    protected $fillable = [
        'name',
        'email',
        'age',
    ];
    protected $table = 'student_details';
    protected $primaryKey = 'student_id';
    protected $guarded = ['id'];

    public $timestamps = false;

    protected $hidden = [
        'password',
        'remember_token'
    ];

    // automatic convert of data types
    protected $casts = [
        'age' => 'integer',
        'created_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    // default values
    protected $attributes = [
        'status' => 'Active'
    ];

    public function profile(){
        return $this->hasOne(Profile::class);
        return $this->hasMany(Book::class);

        // Many Students belong to one College.
        return $this->belongsTo(College::class);
        
        // Students ↔ Courses - Many-to-Many
        return $this->belongsToMany(Course::class);
          
    }

    use SoftDeletes;
}
