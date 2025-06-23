# 💻 PC Parts Selling Store - Full Stack Web Application

An e-commerce platform for buying and managing computer components, developed using **Spring Boot** and **React.js**. This application allows **users** to register, browse and purchase products, while **admins** can manage inventory, users, and orders.

---

## 🧰 Tech Stack

- **Frontend:** React.js, Axios, Tailwind CSS
- **Backend:** Spring Boot, Spring Data JPA, Spring Security
- **Database:** MySQL
- **Authentication:** JWT-based authentication
- **Tools:** Postman, IntelliJ IDEA, VS Code, GitHub

---

## ✨ Features

### 👤 User Side
- User Registration and Login
- Browse and search PC parts
- View detailed product information
- Add items to cart
- Place orders
- View order history

### 🔧 Admin Side
- Admin login
- Add, update, and delete PC parts
- Manage orders and view all order details
- Manage users and inventory

---

## 🔐 User Roles

- **User:** Can register, login, browse products, and place orders
- **Admin:** Has full control over product management, user management, and order processing

---

## 🗄️ Database Design

### Tables

- **Users**
  - `id`, `username`, `email`, `password`, `role`, `phone`, `fullname`
- **Products**
  - `id`, `name`, `description`, `price`, `stock`, `category`, `imageUrl`
- **Orders**
  - `id`, `user_id`, `order_date`, `total_price`, `status`
- **OrderItems**
  - `id`, `order_id`, `product_id`, `quantity`, `price`

---

## 🔐 Authentication

- Implemented with **Spring Security** and **JWT**
- Token-based authentication to secure endpoints
- Role-based access control (Admin vs User)

---

## 📡 API Endpoints (Sample)

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Product
- `GET /api/products` — List all products
- `GET /api/products/{id}` — Get product details
- `POST /api/admin/products` — Create a product (Admin only)
- `PUT /api/admin/products/{id}` — Update product (Admin only)

### Orders
- `POST /api/orders` — Place an order (User)
- `GET /api/orders/user` — View logged-in user's orders
- `GET /api/admin/orders` — View all orders (Admin)

---