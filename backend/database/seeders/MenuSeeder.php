<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Food',
            'Drinks',
            'Desserts',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

        $food = Category::where('name', 'Food')->first();
        $drinks = Category::where('name', 'Drinks')->first();
        $desserts = Category::where('name', 'Desserts')->first();

        $menuItems = [
            [
                'category_id' => $food->id,
                'name' => 'Chicken Burger',
                'description' => 'Juicy chicken burger served with fresh vegetables.',
                'price' => 350,
                'available' => true,
            ],
            [
                'category_id' => $food->id,
                'name' => 'Beef Pizza',
                'description' => 'Delicious pizza topped with seasoned beef and cheese.',
                'price' => 500,
                'available' => true,
            ],
            [
                'category_id' => $food->id,
                'name' => 'Pasta',
                'description' => 'Freshly prepared pasta with a flavorful sauce.',
                'price' => 450,
                'available' => true,
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Coffee',
                'description' => 'Freshly brewed coffee.',
                'price' => 100,
                'available' => true,
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Fresh Juice',
                'description' => 'Refreshing freshly prepared fruit juice.',
                'price' => 150,
                'available' => true,
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Soft Drink',
                'description' => 'Chilled soft drink.',
                'price' => 80,
                'available' => true,
            ],
            [
                'category_id' => $desserts->id,
                'name' => 'Chocolate Cake',
                'description' => 'Rich and delicious chocolate cake.',
                'price' => 200,
                'available' => true,
            ],
            [
                'category_id' => $desserts->id,
                'name' => 'Ice Cream',
                'description' => 'Cold and creamy ice cream.',
                'price' => 150,
                'available' => true,
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::updateOrCreate(
                ['name' => $item['name']],
                $item
            );
        }
    }
}
