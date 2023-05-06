<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User does not exist'], 422);
        } else {
            if ($user && (Hash::check($request->password, $user->password))) {
                if ($user->level == 1 && !$user->approved) {
                    return response()->json(['message' => 'Your account is yet to be approved by the coordinator'], 401);
                }
            }
            else if(!(Hash::check($request->password, $user->password))){
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
            $tokenRequest = $request->create('/oauth/token', 'post', [
                'grant_type' => $request->grant_type,
                'client_id' => $request->client_id,
                'client_secret' => $request->client_secret,
                'username' => $request->email,
                'password' => $request->password,
                'scope' => '',
            ]);

            $response = app()->handle($tokenRequest);
            $responseData = json_decode($response->getContent(), true);
            if ($response->getStatusCode() != 200) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }
            return response()->json(['access_token' => $responseData['access_token'] ,'message' => 'You are now logged in!', 'status' => 'success', 'level' => $user->level], 200);
        }

    }

    public function register(Request $request)
    {
        $formFields = $request->validate([
            'email' => 'required | unique:users',
            'firstName' => 'required',
            'lastName' => 'required',
            'password' => 'required | confirmed',
        ]);

        $formFields['password'] = bcrypt($formFields['password']);
        $formFields = array_merge($formFields, ['level' => 1, 'approved' => false]);
        User::create($formFields);
        return response(['message' => 'Succecssfully registered!', 'status' => 'success'], 200);
    }

}
