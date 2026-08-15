<?php

use Illuminate\Support\Facades\Route;
use app\http\StudentControllerWeb;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/students', [StudentControllerWeb::class, 'index']);

Route::post('/students', [StudentControllerWeb::class, 'create'])->name('students.store');

Route::get('/students/{id}/edit', [StudentControllerWeb::class, 'edit'])->name('students.edit');

Route::put('/students/{id}', [StudentControllerWeb::class, 'update'])->name('students.update');

Route::delete('/students/{id}', [StudentControllerWeb::class, 'destroy'])->name('students.destroy');
