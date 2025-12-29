<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\MatiereController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/roles', function() {
    return \App\Models\Role::all();
});
Route::get('/filieres', function() {
    return \App\Models\Filiere::all();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('demandes', DemandeController::class);
    Route::post('demandes/{id}/valider', [DemandeController::class, 'valider']);
    Route::post('demandes/{id}/rejeter', [DemandeController::class, 'rejeter']);
    Route::post('demandes/{id}/envoyer-au-da', [DemandeController::class, 'envoyerAuDA']);
    Route::post('demandes/{id}/imputer', [DemandeController::class, 'imputer']);
    Route::post('demandes/{id}/corriger', [DemandeController::class, 'corriger']);

    Route::apiResource('matieres', MatiereController::class);

    // Users & Notifications
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::post('users', [\App\Http\Controllers\UserController::class, 'store']);
    Route::delete('users/{id}', [\App\Http\Controllers\UserController::class, 'destroy']);
    Route::get('users/enseignants', [\App\Http\Controllers\UserController::class, 'getEnseignants']);
    Route::get('notifications', [\App\Http\Controllers\UserController::class, 'getNotifications']);
    Route::post('notifications/{id}/read', [\App\Http\Controllers\UserController::class, 'markNotificationAsRead']);
});
