<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:30',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|integer|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $totalAmount = 0;

        foreach ($validated['items'] as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);

            if (!$menuItem->available) {
                return response()->json([
                    'success' => false,
                    'message' => $menuItem->name . ' is currently unavailable.',
                ], 422);
            }

            $totalAmount += $menuItem->price * $item['quantity'];
        }

        $order = DB::transaction(function () use ($validated, $totalAmount) {
            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'total_amount' => $totalAmount,
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::find($item['menu_item_id']);

                $order->orderItems()->create([
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $item['quantity'],
                    'price' => $menuItem->price,
                ]);
            }

            return $order;
        });

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => $order->load('orderItems.menuItem'),
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $order->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => $order->load('orderItems.menuItem'),
        ]);
    }

    public function show(Request $request, $id)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:30',
        ]);

        $order = Order::with('orderItems.menuItem')
            ->where('id', $id)
            ->where('customer_phone', $validated['phone'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found or phone number does not match.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}

