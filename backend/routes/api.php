<?php

use Illuminate\Support\Facades\Route;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\AuthController;

Route::get('/categories', function () {
    return response()->json([
        'success' => true,
        'data' => Category::all(),
    ]);
});

Route::get('/menu', function () {
    return response()->json([
        'success' => true,
        'data' => MenuItem::with('category')
            ->where('available', true)
            ->get(),
    ]);
});

Route::get('/menu/{id}', function ($id) {
    $menuItem = MenuItem::with('category')
        ->where('available', true)
        ->find($id);

    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $menuItem,
    ]);
});

Route::post('/orders', [OrderController::class, 'store']);

Route::get('/orders/{id}', [OrderController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/orders', function () {
        return response()->json([
            'success' => true,
            'data' => Order::with('orderItems.menuItem')
                ->latest()
                ->get(),
        ]);
    });

    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::apiResource('/admin/menu', MenuItemController::class);
});

