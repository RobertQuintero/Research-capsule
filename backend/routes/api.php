<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CapsuleController;
use App\Http\Controllers\PasswordResetTokenController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['middleware' => ['auth:api']], function () {

    Route::get('/getFaculty', [UserController::class, 'getFaculty']);

    Route::get('/getRequest', [UserController::class, 'getRequest']);

    Route::get('/getApprovedFaculty', [UserController::class, 'getApprovedFaculty']);

    Route::prefix('user')->group(function () {

        Route::get('level', [UserController::class, 'getLevel']);

        Route::get('current', [UserController::class, 'getCurrentUser']);

        Route::put('details/update', [UserController::class, 'update']);

        Route::put('approve/{id}', [UserController::class, 'facultyApprove']);

        Route::delete('reject/{id}', [UserController::class, 'facultyReject']);

        Route::post('photo/update', [UserController::class, 'updatePhoto']);

        Route::put('password/update', [UserController::class, 'updatePassword']);

    });

    Route::prefix('capsule')->group(function () {

        Route::get('list', [CapsuleController::class, 'list']);

        Route::get('availableReviewers/{id}', [CapsuleController::class, 'getAvailableReviewers']);

    });

    Route::prefix('review')->group(function() {
        Route::post('store', [ReviewController::class, 'store']);
    });

    Route::prefix('admin')->group(function() {

        Route::put('updateFaculty', [UserController::class, 'updateFaculty']);

        Route::delete('destroyFaculty/{id}', [UserController::class, 'destroyFaculty']);

        Route::get('dashboardData', [AdminController::class, 'dashboardData']);

    });

    Route::prefix('faculty')->group(function() {

        Route::get('getCapsules', [CapsuleController::class, 'getCapsules']);

        Route::get('assignedCapsules', [CapsuleController::class, 'assignedCapsules']);

        Route::post('addCapsule', [CapsuleController::class, 'addCapsule']);

        Route::post('editCapsule', [CapsuleController::class, 'editCapsule']);

        Route::post('reviewCapsule', [ReviewController::class, 'reviewCapsule']);

        Route::put('rejectCapsule', [ReviewController::class, 'rejectCapsule']);

        Route::put('unreviseCapsule', [ReviewController::class, 'unreviseCapsule']);

        Route::post('reviseCapsule', [CapsuleController::class, 'reviseCapsule']);

    });
});

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('store', [PasswordResetTokenController::class, 'store']);

Route::get('token/check/{token}', [PasswordResetTokenController::class, 'checkToken']);

Route::post('password/reset/token/{token}', [PasswordResetTokenController::class, 'resetPasswordFinally']);
