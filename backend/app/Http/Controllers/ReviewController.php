<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Capsule;
use App\Models\User;

class ReviewController extends Controller
{
    public function store(Request $request) {
        // return response()->json(['user_id' => $request->user_id, 'capsule_id' => $request->capsule_id], 200);
        $formFields = $request->validate([
            'user_id' => 'required',
            'capsule_id' => 'required',
        ]);
        Review::create($formFields);
        Capsule::where('id', $request->capsule_id)->update([
            'status' => 'Assigned'
        ]);
        $data = Capsule::with('user', 'reviews.user')->get();
        return response()->json(['success' => "Faculty with id of $request->user_id has been assigned to research capsule with an id of $request->capsule_id successfully", 'data' => $data], 200);
    }

    public function reviewCapsule(Request $request) {
        $review = Review::where('user_id', $request->user()->id)
                ->where('capsule_id', $request->capsule_id)
                ->first();
        $review->update([
            'grade' => $request->grade,
            'comment' => $request->comment,
            'isReviewed' => true
        ]);

        $capsule = Capsule::where('id', $request->capsule_id)->whereHas('reviews', function ($query) {
            $query->where('isReviewed', true)
            ->where('grade', '>', 0);
        }, '>=', 3)->first();

        if ($capsule) {
            $capsule->status = "Completed";
            $capsule->save();
        }

        $user = User::where('id', $request->user()->id)->first();
        $assignedCapsules = Capsule::whereHas('reviews', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['user', 'reviews.user'])->get();

        return response($assignedCapsules, 200);
    }

    public function rejectCapsule(Request $request) {
        $review = Review::where('user_id', $request->user()->id)
                ->where('capsule_id', $request->capsule_id)
                ->first();
        $review->update([
            'grade' => 0,
            'comment' => $request->comment,
            'isReviewed' => true
        ]);
        $capsule = Capsule::where('id', $request->capsule_id)->first();
        $reviewsCount = $capsule->reviews()->count();
        $reviewsWithGradeZeroCount = $capsule->reviews()->where('grade', '=', 0)->count();

        if ($reviewsCount === $reviewsWithGradeZeroCount) {
            // All reviews associated with the capsule have a grade of 0
            // Perform desired actions here
            $capsule->update([
                'status' => 'Under Revision'
            ]);
        }
        else {
            $capsule->update([
                'status' => 'Incomplete'
            ]);
        }
        $user = User::where('id', $request->user()->id)->first();
        $assignedCapsules = Capsule::whereHas('reviews', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['user', 'reviews.user'])->get();

        return response($assignedCapsules, 200);
    }

    public function unreviseCapsule(Request $request) {
        $review = Review::where('user_id', $request->user()->id)
                ->where('capsule_id', $request->capsule_id)
                ->first();
        $review->update([
            'grade' => null,
            'comment' => null,
            'isReviewed' => false
        ]);
        $capsule = Capsule::where('id', $request->capsule_id)->first();
        $capsule->update([
            'status' => 'Incomplete'
        ]);

        $user = User::where('id', $request->user()->id)->first();
        $assignedCapsules = Capsule::whereHas('reviews', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['user', 'reviews.user'])->get();

        return response($assignedCapsules, 200);
    }
}
