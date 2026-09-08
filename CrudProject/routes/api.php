<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Middleware\CheckAge;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/profile', function () {
    return 'Welcome';
})->middleware(CheckAge::class);


// user model.php
// use Laravel\Sanctum\HasApiTokens;

// class User extends Authenticatable
// {
//     use HasApiTokens;
// }


// Route::middleware('auth:sanctum')->get(
//     '/profile',
//     [UserController::class, 'profile']
// );



Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/student/add', [StudentController::class, 'store']);
Route::put('/student/update/{id}', [StudentController::class, 'update']);
Route::put('/student/delete/{id}', [StudentController::class, 'destroy']);