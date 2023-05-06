<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Capsule;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Review;

class AdminController extends Controller
{
    public function dashboardData(Request $request) {
        $capsules = Capsule::with('reviews')->get();
        $reviews = Review::with('user')->get();
        $users = User::where('level', 1)->with('reviews')->get();

        return response()->json(['capsules' => $capsules, 'reviews' => $reviews, 'users' => $users], 200);
    }
}
