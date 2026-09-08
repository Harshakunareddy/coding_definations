<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function getUser($id)
    {
        return User::find($id);
    }
}