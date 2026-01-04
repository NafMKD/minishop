<?php

namespace App\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        return redirect()->intended(
            match ($user->role) {
                'admin' => '/admin/dashboard',
                'user' => '/',
                default => '/',
            }
        );
    }
}
