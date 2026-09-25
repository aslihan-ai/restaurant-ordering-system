\# Restaurant Menu \& Ordering System



A full-stack restaurant menu and ordering web application that allows customers to browse a restaurant menu, add items to a cart, place orders, and track their orders. It also provides an admin dashboard for managing menu items and orders.



\## Live Demo



https://restaurant-ordering-system-2z3x.onrender.com



\## Project Overview



The Restaurant Menu \& Ordering System is a web-based application designed to simplify restaurant ordering and management.



\### Customers can:



\* Browse available menu items

\* Filter menu items by category

\* View food details

\* Add items to a shopping cart

\* Place an order

\* Receive an order confirmation

\* Look up their order status using their order ID and phone number



\### Administrators can:



\* Log in securely

\* View the dashboard

\* Add menu items

\* Edit menu items

\* Delete menu items

\* View customer orders

\* Update order status

\* Log out of the admin system



\## Technologies Used



\### Frontend



\* React

\* Vite

\* Axios

\* JavaScript

\* CSS



\### Backend



\* Laravel 13

\* PHP 8.3

\* REST API

\* Laravel Sanctum



\### Database



\* SQLite for local development

\* PostgreSQL for production



\### Deployment



\* GitHub

\* Render



\## System Architecture



The application follows a client-server architecture:



React Frontend → Axios → Laravel REST API → Database



The React frontend communicates with the Laravel backend through REST API endpoints. The backend handles requests, validation, business logic, and database operations.



\## Main Features



\### Customer Features



\#### Menu



Customers can browse available restaurant menu items and filter them by category.



\#### Food Details



Customers can view information about individual menu items, including name, description, price, and availability.



\#### Shopping Cart



Customers can add multiple menu items to their cart, change quantities, and view the calculated total.



\#### Checkout



Customers provide their name and phone number before placing an order.



\#### Order Tracking



Customers can enter their order ID and phone number to check the current status of their order.



\### Admin Features



\#### Admin Login



Administrators can log in to access protected management pages.



\#### Menu Management



Administrators can:



\* Create menu items

\* Update menu items

\* Delete menu items

\* Control item availability



\#### Order Management



Administrators can view customer orders and update their status.



Order statuses follow this workflow:



Pending → Preparing → Ready → Completed



\## REST API



The Laravel backend provides REST API endpoints used by the frontend.



\### Public Endpoints



| Method | Endpoint                     | Description                   |

| ------ | ---------------------------- | ----------------------------- |

| GET    | `/api/categories`            | Get all menu categories       |

| GET    | `/api/menu`                  | Get all menu items            |

| GET    | `/api/menu/{id}`             | Get a specific menu item      |

| POST   | `/api/orders`                | Create a new customer order   |

| GET    | `/api/orders/{id}?phone=...` | Look up a customer's order    |

| POST   | `/api/login`                 | Authenticate an administrator |



\### Protected Admin Endpoints



| Method | Endpoint                  | Description                  |

| ------ | ------------------------- | ---------------------------- |

| POST   | `/api/logout`             | Log out administrator        |

| GET    | `/api/orders`             | Get all orders               |

| PUT    | `/api/orders/{id}/status` | Update order status          |

| GET    | `/api/admin/menu`         | Get menu items               |

| POST   | `/api/admin/menu`         | Create a menu item           |

| PUT    | `/api/admin/menu/{id}`    | Update a menu item           |

| PATCH  | `/api/admin/menu/{id}`    | Partially update a menu item |

| DELETE | `/api/admin/menu/{id}`    | Delete a menu item           |



\## Example Menu



| Category | Item           |   Price |

| -------- | -------------- | ------: |

| Food     | Chicken Burger | 350 ETB |

| Food     | Beef Pizza     | 500 ETB |

| Food     | Pasta          | 450 ETB |

| Drinks   | Coffee         | 100 ETB |

| Drinks   | Fresh Juice    | 150 ETB |

| Drinks   | Soft Drink     |  80 ETB |

| Desserts | Chocolate Cake | 200 ETB |

| Desserts | Ice Cream      | 150 ETB |



\## Local Development



\### Backend



The Laravel backend is located in the `backend` directory.



Install the PHP dependencies:



`composer install`



Create the environment file:



`copy .env.example .env`



Generate the application key:



`php artisan key:generate`



Run the database migrations:



`php artisan migrate`



Seed the menu data:



`php artisan db:seed`



Start the Laravel development server:



`php artisan serve`



The backend will run at:



http://127.0.0.1:8000



\### Frontend



The React frontend is located in the `frontend` directory.



Install the dependencies:



`npm install`



Start the Vite development server:



`npm run dev`



The frontend will normally run at:



http://localhost:5173



\## Production Deployment



The project is deployed using Render.



The production system consists of:



\* React/Vite frontend deployed as a Render Static Site

\* Laravel backend deployed as a Render Web Service

\* PostgreSQL database hosted on Render



The frontend communicates with the production Laravel API through the configured production API URL.



\## Testing



The Laravel backend was tested using:



`php artisan test`



The application was also manually tested through the customer ordering process and the administrator dashboard.



\## Project Structure



restaurant-ordering-system/



\* backend/

\* frontend/

\* .gitignore

\* README.md



\## GitHub Repository



https://github.com/aslihan-ai/restaurant-ordering-system



\## Author



Developed as a full-stack web application project using React, Laravel, REST API, and PostgreSQL.



