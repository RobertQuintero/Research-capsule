<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function getRequest()
    {
        $faculties = User::where('level', 1)->where('approved', 0)->get();
        return response($faculties, 200);
    }

    public function getLevel(Request $request)
    {
        $user = User::where('id', $request->user()->id)->first();
        return response(['level' => $user->level], 200);
    }

    public function getFaculty(Request $request)
    {
        $faculties = User::where('level', 1)->get();
        return response($faculties, 200);
    }

    public function getCurrentUser(Request $request)
    {
        $user = User::where('id', $request->user()->id)->first();

        return response($user, 200);
    }

    public function update(Request $request)
    {
        $user = User::where('id', $request->user()->id)->first();
        if ($user) {
            $formFields = $request->validate([
                'email' => 'required | email | unique:users,email,' . $user->id,
                'firstName' => 'required',
                'lastName' => 'required',
            ]);
            $user->update($formFields);
            return response(['status' => 'success', 'message' => 'Your details were updated successfully!'], 200);
        } else {
            return response(['message' => 'Something went wrong'], 401);
        }
    }

    public function facultyApprove(Request $request, $id)
    {
        $faculty = User::where('id', $id)->first();
        $faculty->update([
            'approved' => true
        ]);
        $faculties = User::where('level', 1)->where('approved', 0)->get();
        return response(['message' => "faculty with the name of {$faculty->firstName} {$faculty->lastName} is successfully approved", 'faculties' => $faculties], 200);
    }

    public function facultyReject(Request $request, $id)
    {
        $faculty = User::where('id', $id)->first();
        $first = $faculty->firstName;
        $last = $faculty->lastName;
        $faculty->delete();
        $faculties = User::where('level', 1)->where('approved', 0)->get();
        return response(['message' => "faculty with the name of {$first} {$last} is successfully rejected", 'faculties' => $faculties], 200);
    }

    public function updatePhoto(Request $request)
    {
        $user = User::where('id', $request->user()->id)->first();

        $file = $request->file('photo');
        if (!$file) {
            return response()->json(['message' => 'No file uploaded'], 422);
        }
        if (!in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
            return response()->json(['message' => 'File must be an image'], 422);
        }
        if ($file->getSize() > 2000000) {
            return response()->json(['message' => 'File size must be less than or equal to 2 MB'], 422);
        }
        if ($user->photo ?? false) {
            File::delete($user->photo);
        }

        $path = $file->store('photos', 'public');
        $user->update(['photo' => "storage/" . $path]);
        return response([
            'status' => 'Success',
            'message' => 'Photo changed successfully!',
            'imageUrl' => "storage/" . $path
        ]);
    }

    public function getApprovedFaculty(Request $request)
    {
        $approvedFaculties = User::where('level', 1)->where('approved', 1)->with('reviews', 'capsules')->get();
        return response($approvedFaculties, 200);
    }

    public function updateFaculty(Request $request)
    {
        $faculty = User::where('id', $request->id)->first();
        if ($faculty) {
            $formFields = $request->validate([
                'email' => 'required | email | unique:users,email,' . $faculty->id,
                'firstName' => 'required',
                'lastName' => 'required',
            ]);
            $faculty->update($formFields);
            $approvedFaculties = User::where('level', 1)->where('approved', true)->get();
            return response($approvedFaculties, 200);
        } else {
            return response()->json(['error' => 'something happened'], 422);
        }
    }
    public function destroyFaculty(Request $request, $id)
    {
        User::where('id', $id)->delete();
        $approvedFaculties = User::where('level', 1)->where('approved', true)->get();
        return response($approvedFaculties, 200);
    }

    public function updatePassword(Request $request)
    {
        $user = User::where('id', $request->user()->id)->first();

        if ($user && (Hash::check($request->password_old, $user->password))) {
            $formFields = $request->validate([
                'password' => 'required | confirmed'
            ]);

            $formFields['password'] = bcrypt($formFields['password']);

            $user->update($formFields);

            return response(['message' => 'Password changed successfully!'], 200);
        } else {
            return response(['message' => 'Error! Wrong Password'], 422);
        }
    }
}
