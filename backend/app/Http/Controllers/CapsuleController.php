<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Capsule;
use App\Models\User;
use App\Models\Review;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class CapsuleController extends Controller
{
    public function list(Request $request){
        if($request->user()->level != 0){
            return response(['message' => 'Unauthorized access'], 422);
        }
        $data = Capsule::with('user', 'reviews.user')->get();
        return response($data ,200);
    }

    public function getAvailableReviewers(Request $request, $id) {
        $capsule = Capsule::where('id', $id)->first();
        $facultyIdToExclude = $capsule->user_id;

        $faculties = User::where('level', 1)
        ->where('approved', true)
        ->whereDoesntHave('reviews', function ($query) use ($id) {
            $query->where('capsule_id', $id);
        })
        ->whereNotIn('id', function ($query) use ($facultyIdToExclude) {
            $query->select('user_id')
                ->from('capsules')
                ->where('user_id', $facultyIdToExclude);
        })
        ->get();

        return response($faculties, 200);
    }

    public function getCapsules(Request $request) {
        $capsules = Capsule::where('user_id', $request->user()->id)->with('user', 'reviews.user')->get();
        return response($capsules, 200);
    }

    public function addCapsule(Request $request) {
        $user = User::where('id', $request->user()->id)->first();
        if (!$request->hasFile('capsule')) {
            return response()->json(['message' => 'Research capsule is missing'], 422);
        }
        $file = $request->file('capsule');
        if (!in_array($file->getClientOriginalExtension(), ['docx', 'pdf', 'doc'])) {
            return response()->json(['message' => 'Research capsule must be of type document'], 422);
        }
        if ($file->getSize() > 5000000) {
            return response()->json(['message' => "Research capsule's size must be less than or equal to 5 MB"], 422);
        }
        $path = $file->store('files', 'public');
        Capsule::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'research_file' => "storage/$path",
            'description' => $request->description,
            'status' => 'Unassigned'

        ]);

        $capsules = Capsule::where('user_id', $request->user()->id)->with('user')->get();
        return response()->json(['message' => 'Research capsule added successfully', 'data' => $capsules], 200);
    }

    public function editCapsule(Request $request) {
        $user = User::where('id', $request->user()->id)->first();
        $capsule = Capsule::where('id', $request->id)->first();
        if (!$request->hasFile('editCapsule')) {
            return response()->json(['message' => 'Research capsule is missing'], 422);
        }
        $file = $request->file('editCapsule');
        if (!in_array($file->getClientOriginalExtension(), ['docx', 'pdf', 'doc'])) {
            return response()->json(['message' => 'Research capsule must be of type document'], 422);
        }
        if ($file->getSize() > 5000000) {
            return response()->json(['message' => "Research capsule's size must be less than or equal to 5 MB"], 422);
        }
        if ($capsule->research_file ?? false) {
            FIle::delete($capsule->research_file);
        }

        $path = $file->store('photos', 'public');

        $capsule->update([
            'title' => $request->editTitle,
            'description' => $request->editDescription,
            'research_file' => "storage/$path"
        ]);
        $capsules = Capsule::where('user_id', $request->user()->id)->with('user')->get();
        return response()->json(['message' => 'Research capsule edited successfully', 'data' => $capsules], 200);
    }

    public function reviseCapsule(Request $request) {
        $reviews = Review::where('capsule_id', $request->id)
        ->where('isReviewed', 1)
        ->where('grade', 0)
        ->get();
        $capsule = Capsule::where('id', $request->id)->first();
        if (!$request->hasFile('reviseCapsule')) {
            return response()->json(['message' => 'Research capsule is missing'], 422);
        }
        $file = $request->file('reviseCapsule');
        if (!in_array($file->getClientOriginalExtension(), ['docx', 'pdf', 'doc'])) {
            return response()->json(['message' => 'Research capsule must be of type document'], 422);
        }
        if ($file->getSize() > 5000000) {
            return response()->json(['message' => "Research capsule's size must be less than or equal to 5 MB"], 422);
        }
        if ($capsule->research_file ?? false) {
            FIle::delete($capsule->research_file);
        }

        $path = $file->store('photos', 'public');

        $capsule->update([
            'title' => $request->reviseTitle,
            'description' => $request->reviseDescription,
            'research_file' => "storage/$path",
            'status' => "Assigned"
        ]);

       

        foreach ($reviews as $review) {
            $review->grade = null;
            $review->isReviewed = 0;
            $review->save();
        }

        $capsules = Capsule::where('user_id', $request->user()->id)->with('user', 'reviews.user')->get();
        return response($capsules, 200);
    }

    public function assignedCapsules(Request $request) {
        $user = User::where('id', $request->user()->id)->first();
        $assignedCapsules = Capsule::whereHas('reviews', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['user', 'reviews.user'])->get();
        
        return response($assignedCapsules, 200);
    }

    

}
