<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Repositories\UserRepository;

class UserController extends Controller
{
    public function show($id)
    {
        $user = (new UserRepository)->getUser($id);

        return new UserResource($user);
    }
}