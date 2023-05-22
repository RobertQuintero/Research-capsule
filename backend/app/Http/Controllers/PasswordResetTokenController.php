<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ForgotMail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PasswordResetToken;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class PasswordResetTokenController extends Controller
{
    public function store(Request $request){
        $user = User::where('email', $request->email)->first();
        if(!$user){
            return response(['message' => 'Email does not exists'], 400);
        }
        if(PasswordResetToken::where('email', $user->email)->exists()){
            return response(['message' => 'You already have a pending password reset request, please contact the admin.'], 400);
        }
        else {
            $token = Str::random(64);
            $message = "You have requested to change your password, here's the link for your password request change: $request->domain/reset-password/$token";
            PasswordResetToken::create(
                [
                    'email' => $user->email,
                    'token' => $token,
                    'created_at' => Carbon::now()
                ]
            );

            $details = [
                'title' => "Mail from Research Capsule Review System",
                'body' => $message
            ];
            Mail::to($user->email)->send(new ForgotMail($details));

            return response(['message' => "An email has been sent, please check your email"]);
        }
    }

    public function checkToken($token){
        if(PasswordResetToken::where('token', $token)->exists()){
            return response(['message' => 'token valid'], 200);
        }
        else {
            return response(['message' => 'token invalid'], 400);
        }
    }

    public function resetPasswordFinally($token, Request $request){
        if(PasswordResetToken::where('token', $token)->exists()){
            $token = PasswordResetToken::where('token', $token)->first();
            $user = User::where('email', $token->email)->first();
            $formFields = $request->validate([
                'password' => 'required | confirmed'
            ]);
            $user->update([
                'password' => bcrypt($formFields['password'])
            ]);
            PasswordResetToken::where('email', $user->email)->delete();
            return response(['message' => 'Successful ka!!'],200);
        }
        else {
            return response(['message' => 'token invalid'], 400);
        }
    }
}
