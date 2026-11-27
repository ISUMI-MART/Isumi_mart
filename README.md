# Isumi Mart

https://isumi-mart.vercel.app/

A web-based grocery management system developed for **Isumi Mart**. The system helps replace manual, paper-based shop operations with a centralized digital platform for managing grocery products, inventory, customer orders, deliveries, walk-in sales, suppliers, and Cash on Delivery payments.

Customers can browse products and place online grocery orders, while the Owner manages products, stock, online orders, physical shop sales, deliveries, and reports. Delivery Agents can view assigned deliveries and update delivery status.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [System Workflow](#system-workflow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Installation and Setup](#installation-and-setup)
- [Available Scripts](#available-scripts)
- [Main Pages](#main-pages)
- [API Modules](#api-modules)
- [Team Members](#team-members)
- [Future Improvements](#future-improvements)
- [AI Usage Declaration](#ai-usage-declaration)

---

## Project Overview

**Isumi Mart** is an Online Grocery Management System designed for a small grocery shop. The system provides a simple digital solution for managing both online grocery orders and walk-in shop sales.

The platform supports the complete grocery process:

```text
Product Management → Inventory Management → Customer Order →
Owner Confirmation → Delivery Assignment → Delivery Status Update →
Cash on Delivery Collection → Sales Records and Reports
```

The project is designed for a local grocery business that needs a practical and affordable way to manage daily activities without using complicated enterprise systems.

---

## Problem Statement

Isumi Mart currently depends on manual records for product details, stock quantities,bills, and sales information. Manual processes can cause problems such as:

- Incorrect stock quantities
- Lost or incomplete records
- Difficulty identifying low-stock products
- Difficulty preparing sales information
- Errors when managing pos.

This system solves these problems by storing important business information in one centralized PostgreSQL database.

---

## Key Features

### Customer Features

- Register and log in securely using JWT/bcrypt
- Browse available grocery products
- Search products by name
- Filter products by category
- View product prices, availability, and details
- Add products to the shopping cart
- Update cart item quantities
- Remove products from the cart
- Add or select a delivery address
- Place online orders using Cash on Delivery
- View personal order history
- Track order and delivery status
- View delivery details
- Cancel orders

### Owner Features

The Owner manages all shop activities. There is no separate Cashier role in this system.

- Manage product categories
- Add, update, deactivate, and view products
- Manage product prices, images, units, and stock levels
- View inventory quantities
- View low-stock products
- Manage online orders
- Confirm, prepare, and update customer orders
- Assign a delivery agent to an order
- Manage delivery status
- Record walk-in customer sales
- Generate bills for walk-in sales
- View Cash on Delivery payment status
- View sales, order, inventory, and delivery reports
- Create and manage delivery-agent accounts

### Delivery Agent Features

- Log in securely using JWT/bcryptr
- View assigned deliveries
- View customer delivery details
- Update delivery status
- Mark an order as picked up
- Mark an order as out for delivery
- Mark an order as delivered
- Mark a delivery as failed when necessary
- Record Cash on Delivery collection after successful delivery

---

## User Roles

| Role | Description | Main Permissions |
|---|---|---|
| Customer | A user who purchases groceries online | Browse products, manage cart, place COD orders, track personal orders |
| Owner | The main shop administrator | Manage products, inventory, online orders, walk-in sales, delivery agents, and reports |
| Delivery Agent | A staff member who delivers confirmed online orders | View assigned deliveries, update delivery status, collect COD payments |

---

## System Workflow

### Online Order Workflow

```text
Customer Registration/Login
        ↓
Browse Products
        ↓
Add Products to Cart
        ↓
Checkout With Cash on Delivery
        ↓
Stock Availability Check
        ↓
Create Pending Order
        ↓
Owner Confirms and Prepares Order
        ↓
Owner Assigns Delivery Agent
        ↓
Delivery Agent Picks Up Order
        ↓
Order Is Out for Delivery
        ↓
Customer Receives Order
        ↓
Delivery Agent Collects Cash on Delivery Payment
        ↓
Order and Payment Marked as Completed
```

### Walk-In Sale Workflow

```text
Owner Selects Products
        ↓
Owner Adds Product Quantities
        ↓
System Calculates Total Amount
        ↓
Customer Pays Cash
        ↓
Owner Confirms Walk-In Sale
        ↓
Inventory Is Reduced
        ↓
Sales Record and Bill Are Created
```

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface development |
| Tailwind CSS | Styling and responsive user interface design |
| shadcn/ui | Reusable UI components |
| Lucide React | Icons |
| Prisma ORM | Database schema, migrations, and database queries |
| PostgreSQL | Relational database |
| Node.js | Server-side JavaScript runtime |
| Git and GitHub | Version control and team collaboration |
| Jira | Sprint planning, task tracking, and project management |

---

## Project Structure

```text
## Project Structure

```text
Isumi_mart/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── generated/
│   │   ├── middleware/
|   |   ├── models/
│   │   ├── repository/
│   │   ├── routes/
│   │   ├── service/
│   │   └── util/
│   │   ├── app.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── .env.example
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── app.css
│   │   └── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── tests/
│   ├── auth.spec.js
│   └── customer.spec.js
│   └── delivery.spec.js
│   └── owner.spec.js
│
├── .gitignore
└── README.md

```

---

## Database Design

The system uses PostgreSQL with Prisma ORM.

Main database entities include:

| Entity | Description |
|---|---|
| User | Stores the Isumi Mart profile linked to a Clerk user ID |
| Address | Stores saved customer delivery addresses |
| Category | Stores grocery product categories |
| Product | Stores product information, prices, status, and category |
| Stock | |
| StockMovement | Records every increase or decrease in stock |
| CartItem | Stores products and quantities in a cart |
| Order | Stores customer online orders |
| OrderItem | Stores product and pricing details for each order |
| WalkInSale | Stores physical shop sales managed by the Owner |
| WalkInSaleItem | Stores products included in a walk-in sale |

### Important Database Rules

- A customer can access only their own online orders.
- A delivery agent can access only deliveries assigned to them.
- Product prices are saved in order items so previous orders retain the correct historical price.
- Stock movements are recorded for purchases, online orders, walk-in sales, damaged stock, and manual adjustments.
- Cash on Delivery payments remain `PENDING` until the order is successfully delivered and cash is collected.
- Products should be marked as inactive instead of permanently deleted when they have sales history.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Isumi_mart.git
cd Isumi_mart
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file and add the required environment variables:

```env
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret"

```

Generate the Prisma Client:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Run the Application

After starting both the backend and frontend, open the frontend URL shown in the terminal, for example:

```text
http://localhost:5173
```

The backend API will run on:

```text
http://localhost:4000
```

### 5. Running Tests

From the project root, install Playwright if it has not already been installed:

```bash
npx playwright install
```

Run the tests:

```bash
npx playwright test
```

To run tests with the browser visible:

```bash
npx playwright test --headed
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npx prisma studio` | Opens Prisma Studio to view and manage database records |
| `npx prisma migrate dev` | Creates and applies a development migration |
| `npx prisma generate` | Generates Prisma Client |

---

## Main Pages

### Public Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page and featured products |
| Products | `/products` | Product browsing, search, and filtering |
| Product Details | `/products/[id]` | Product information and add-to-cart option |
| Login | `/login` |  Login page |
| Register | `/register` | Registration page |

### Customer Pages

| Page | Route | Description |
|---|---|---|
| Cart | `/cart` | View, edit, and remove cart items |
| Checkout address | `/checkout/address` | Add delivery details |
| Order summary | `/checkout/summary` | One last check before placing the order |
| Order confirmation | `/order-confirmation/[id]` | View order details and order place message |
| Order history | `/orders` | View all current and past orders |
| Track order | `/orders/[id]` | View order items, payment, and delivery status |

### Owner Pages

| Page | Route | Description |
|---|---|---|
| Owner Dashboard | `/owner/overview` | Sales, order, inventory, and delivery summary |
| Inventory | `/owner/inventory` | View stock, low stock, and select category |
| Suppliers | `/owner/suppliers` | Manage suppliers |
| Online Orders | `/owner/orders` | Confirm, prepare, and assign orders |
| Delivery agents | `/owner/deliveriy-agents` | Assign delivery agents and monitor delivery status |
| Walk-In Sales | `/owner/walk-in-sales` | Record physical shop sales |
| Reports | `/owner/reports` | View sales, inventory, order, and delivery reports |

### Delivery Agent Pages

| Page | Route | Description |
|---|---|---|
| Delivery Dashboard | `/delivery` | Summary of assigned deliveries |
| Delivery completed | `/delivery/completed` | View completed deliveries |

---

## API Modules

The application API is organized around the following modules:

| Module | Main Responsibilities |
|---|---|
| Authentication | JWT authentication and role validation |
| Users | Customer profiles, owner accounts, delivery-agent accounts |
| Categories | Create, update, list, and deactivate categories |
| Products | Product CRUD operations, search, filtering, and availability |
| Cart | Add items, update quantities, remove items, and view cart |
| Orders | Online checkout, stock validation, order management, and order history |
| Deliveries | Delivery assignment, delivery tracking, and status updates |
| Walk-In Sales | Physical-shop billing, sale records, and stock reduction |
| Reports | Daily sales, order, inventory, and delivery summaries |

---

## Security and Access Control

- Customer registration is handled through JWT auth system.
- Customer login is handled through JWT.
- Access to protected pages and API routes is controlled by user role.
- Public registration creates only a `CUSTOMER` account.
- Owner accounts and delivery-agent accounts are created or managed through protected Owner functions.
- The Owner role can access all management features.
- Delivery Agents can access only their assigned deliveries.
- Customers can access only their own carts, addresses, and orders.
- Sensitive environment variables are stored in `.env` files and excluded from Git.

---

## Team Members

| Team Member | Role | Main Contribution |
|---|---|---|
| M.A.C.J. Perera | Project Manager + Backend Support | Project planning, Jira management, documentation, testing coordination, API documentation, and deployment support |
| H.N. Jayalath | Backend Developer + Database Administrator | PostgreSQL database, Prisma schema, backend APIs, inventory logic, order logic, JWT authentication, and role authorization |
| V.R. De Alwis Karunarathne | Frontend Developer | Owner portal, delivery-agent portal, dashboards, product management, order management, and delivery interfaces |
| K.A.H.B. Kasthuriarachchi | Frontend Developer | Customer portal, product browsing, authentication UI, cart, checkout, customer orders, and tracking pages |

---

## Project Management

The project is managed using Jira and is organized into the following development stages:

1. Project planning, requirement gathering, and system design
2. Database, Prisma schema, and backend API development
3. Customer, Owner, and Delivery Agent frontend development
4. Frontend and backend integration
5. Testing, bug fixing, deployment, documentation, and final demonstration

---

## Future Improvements

Possible future improvements include:

- Online card payment gateway integration
- SMS or email notifications for order updates
- WhatsApp order notifications
- Customer product reviews and ratings
- Product discounts and promotional codes
- Multiple shop branches
- Barcode scanning for walk-in sales
- Advanced sales and profit reports
- Supplier payment and credit tracking
- Delivery route optimization
- Sinhala and Tamil language support
- Progressive Web App support
- Owner staff invitation system through email
- Product recommendations based on previous customer orders

---

## AI Usage Declaration

Figma AI was used during the planning stage to explore UI ideas and create an initial sample prototype/wireframe. The generated code was not directly used as the final system implementation unless explicitly stated in project documentation.

The final project design, database schema, frontend implementation, backend logic, integration, testing, and documentation are developed and reviewed by the project team.

---

This project was developed as a university group project for educational purposes.

All rights reserved by the Isumi Mart Project Team.
