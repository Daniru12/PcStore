
## 🖥️ PC Store Management System

A full-stack eCommerce web application for managing PC components, custom PC orders, and user accounts. Built using **Spring Boot** and **Next.js**, the system supports ordering, admin control, and secure user authentication with JWT.

---

### 📚 Table of Contents

* [🛠️ Tech Stack](#-tech-stack)
* [📦 Backend Features](#-backend-features)
* [💻 Frontend Features](#-frontend-features)
* [🔧 Installation](#-installation)
* [📂 Folder Structure](#-folder-structure)
* [🌐 API Endpoints](#-api-endpoints)
* [📸 Sample JSON](#-sample-order-json)
* [🧪 Testing](#-testing)
* [🙌 Contribution](#-contribution)
* [📄 License](#-license)

---

## 🛠️ Tech Stack

### 🔙 Backend (Spring Boot)

* Java 17, Spring Boot 3
* Spring Data JPA
* Hibernate, MySQL
* ModelMapper
* JWT Authentication
* Role-based access

### 🔜 Frontend (Next.js)

* Next.js 14+
* Tailwind CSS
* Axios, React Hook Form
* JWT integration with cookies/localStorage

---

## 📦 Backend Features

* 🔐 User registration/login with JWT
* 📦 Add/Edit/Delete PC Parts and Prebuilt PCs
* 🛒 Place orders with PCs and Parts
* 👁️ View orders (by user / admin)
* ⚙️ Change order status (admin)
* 🧠 Calculates subtotal, tax, total

---

## 💻 Frontend Features

* 🧑 User Login/Register forms
* 🧩 View all parts and PCs
* 🛒 Add products to cart/order
* 📋 View placed orders
* 🔐 Admin dashboard to manage products and orders
* Responsive design with Tailwind CSS

---

## 🔧 Installation

### 🗃️ Clone the Repository

```bash
git clone https://github.com/your-username/pcstore.git
cd pcstore
```

---

### 🛠 Backend Setup (`/backend`)

```bash
cd backend

# Update MySQL credentials in application.properties
spring.datasource.username=root
spring.datasource.password=yourpassword

# Run with Maven
mvn spring-boot:run
```

✅ The backend runs at `http://localhost:8080`

---

### 💻 Frontend Setup (`/frontend`)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

✅ The frontend runs at `http://localhost:3000`

---

## 📂 Folder Structure

```
pcstore/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── pages/
│   ├── components/
│   └── next.config.js
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register new user       |
| POST   | `/api/auth/login`    | Login and get JWT       |
| GET    | `/api/parts`         | List parts              |
| POST   | `/api/parts`         | Add part (admin)        |
| GET    | `/api/pcs`           | List PCs                |
| POST   | `/api/pcs`           | Add PC (admin)          |
| POST   | `/api/orders/add`    | Place new order         |
| GET    | `/api/orders/all`    | View all orders (admin) |
| GET    | `/api/orders/{id}`   | Get single order        |
| DELETE | `/api/orders/{id}`   | Delete order            |

---

## 📸 Sample Order JSON

```json
{
  "customerName": "Daniru",
  "customerEmail": "daniru@example.com",
  "customerPhone": "+94771234567",
  "orderDate": "2025-06-26",
  "estimatedDelivery": "2025-06-30",
  "status": "PENDING",
  "parts": [{ "id": 1 }],
  "pcs": [{ "id": 2 }],
  "notes": "Please deliver ASAP"
}
```

---

## 🔐 Role-based Access

* **USER**: Can browse, add orders, view own orders
* **ADMIN**: Full access to users, orders, products, and status control

JWT token is stored in `localStorage` or `cookies` and sent with requests via `Authorization: Bearer <token>` header.

---

## 🧪 Testing

You can test the API with **Postman** or use the **Next.js frontend**. Ensure CORS is configured in your backend (`@CrossOrigin`).

---

## 🙌 Contribution

Pull requests are welcome! If you'd like to suggest new features or fixes, please create an issue.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developed By

**Daniru Punsith**
[Portfolio Website](https://portfolio-my-daniru.vercel.app/)

**Lasan Navodya**
[Portfolio Website](https://lasanportfolio.netlify.app/)

