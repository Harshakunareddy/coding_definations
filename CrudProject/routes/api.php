<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/student/add', [StudentController::class, 'store']);
Route::put('/student/update/{id}', [StudentController::class, 'update']);
Route::put('/student/delete/{id}', [StudentController::class, 'destroy']);