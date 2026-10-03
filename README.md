# Isumi Mart

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
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Main Pages](#main-pages)
- [API Modules](#api-modules)
- [Team Members](#team-members)
- [Future Improvements](#future-improvements)
- [License](#license)

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

Isumi Mart currently depends on manual records for product details, stock quantities, customer orders, bills, deliveries, and sales information. Manual processes can cause problems such as:

- Incorrect stock quantities
- Lost or incomplete records
- Delays in processing customer orders
- Difficulty tracking Cash on Delivery payments
- Difficulty identifying low-stock and expired products
- Limited visibility of delivery status
- Difficulty preparing daily sales information
- Errors when managing walk-in customer sales and online orders separately

This system solves these problems by storing important business information in one centralized PostgreSQL database.

---

## Key Features

### Customer Features

- Register and log in securely using Clerk
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

### Owner Features

The Owner manages all shop activities. There is no separate Cashier role in this system.

- Manage product categories
- Add, update, deactivate, and view products
- Manage product prices, images, units, and stock levels
- Manage suppliers
- Record stock purchases from suppliers
- View inventory quantities
- View low-stock products
- View products close to expiry
- Manage online orders
- Confirm, prepare, cancel, and update customer orders
- Assign a delivery agent to an order
- Manage delivery status
- Record walk-in customer sales
- Generate bills for walk-in sales
- View Cash on Delivery payment status
- View sales, order, inventory, and delivery reports
- Create and manage delivery-agent accounts

### Delivery Agent Features

- Log in securely using Clerk
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
| Owner | The main shop administrator | Manage products, inventory, suppliers, online orders, walk-in sales, delivery agents, and reports |
| Delivery Agent | A staff member who delivers confirmed online orders | View assigned deliveries, update delivery status, collect COD payments |

> **Note:** The system does not include a separate Cashier role. The Owner manages both online orders and walk-in customer sales.

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

### Stock Purchase Workflow

```text
Owner Creates Supplier Record
        ↓
Owner Creates Purchase Order
        ↓
Supplier Delivers Products
        ↓
Owner Receives Stock
        ↓
System Increases Inventory Quantity
        ↓
Product Batch and Expiry Details Are Recorded
        ↓
Stock Movement History Is Created
```

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface development |
| Tailwind CSS | Styling and responsive user interface design |
| shadcn/ui | Reusable UI components |
| Lucide React | Icons |
| Clerk | User registration, login, session management, and role-based authentication |
| Prisma ORM | Database schema, migrations, and database queries |
| PostgreSQL | Relational database |
| Node.js | Server-side JavaScript runtime |
| Git and GitHub | Version control and team collaboration |
| Jira | Sprint planning, task tracking, and project management |

---

## Project Structure

```text

```

> The actual folder structure may change slightly as the project develops.

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
| Inventory | Stores the current available quantity for each product |
| ProductBatch | Stores received stock batches and expiry dates |
| Supplier | Stores supplier information |
| PurchaseOrder | Stores owner stock-purchase records |
| PurchaseOrderItem | Stores products included in a stock purchase |
| StockMovement | Records every increase or decrease in stock |
| Cart | Stores a customer’s active shopping cart |
| CartItem | Stores products and quantities in a cart |
| Order | Stores customer online orders |
| OrderItem | Stores product and pricing details for each order |
| Payment | Stores Cash on Delivery payment status |
| Delivery | Stores delivery-agent assignment and delivery progress |
| WalkInSale | Stores physical shop sales managed by the Owner |
| WalkInSaleItem | Stores products included in a walk-in sale |

### Important Database Rules

- Clerk manages authentication credentials; passwords are not stored in the Isumi Mart database.
- Each system user is linked to Clerk through `clerkUserId`.
- A customer can access only their own online orders.
- A delivery agent can access only deliveries assigned to them.
- Product prices are saved in order items so previous orders retain the correct historical price.
- Stock movements are recorded for purchases, online orders, walk-in sales, damaged stock, expired products, and manual adjustments.
- Cash on Delivery payments remain `PENDING` until the order is successfully delivered and cash is collected.
- Products should be marked as inactive instead of permanently deleted when they have sales history.

---

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js version 18 or later
- npm, pnpm, or yarn
- PostgreSQL
- A Clerk account and Clerk application
- Git

### 1. Clone the Repository

```bash

```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```bash
cp .env.example .env
```

Then add your database and Clerk values.

### 4. Create the Database

Create a PostgreSQL database named:

```text
isumi_mart
```

Example using PostgreSQL command line:

```sql
CREATE DATABASE isumi_mart;
```

### 5. Run Prisma Migration

```bash
npx prisma migrate dev --name initial_schema
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file using the following example.

```env
# PostgreSQL Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/isumi_mart?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Application Configuration
NEXT_PUBLIC_APP_NAME=Isumi Mart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Never commit `.env` files, database passwords, Clerk secret keys, or production credentials to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.local
node_modules
.next
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs lint checks |
| `npx prisma studio` | Opens Prisma Studio to view and manage database records |
| `npx prisma migrate dev` | Creates and applies a development migration |
| `npx prisma generate` | Generates Prisma Client |
| `npx prisma format` | Formats the Prisma schema |

---

## Main Pages(The actual pages may change slightly as the project develops. )

### Public Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page and featured products |
| Products | `/products` | Product browsing, search, and filtering |
| Product Details | `/products/[id]` | Product information and add-to-cart option |
| Login | `/sign-in` | Clerk login page |
| Register | `/sign-up` | Clerk registration page |

### Customer Pages

| Page | Route | Description |
|---|---|---|
| Cart | `/customer/cart` | View, edit, and remove cart items |
| Checkout | `/customer/checkout` | Add delivery details and place COD order |
| My Orders | `/customer/orders` | View customer order history |
| Order Details | `/customer/orders/[id]` | View order items, payment, and delivery status |
| Addresses | `/customer/addresses` | Manage saved delivery addresses |

### Owner Pages

| Page | Route | Description |
|---|---|---|
| Owner Dashboard | `/owner/dashboard` | Sales, order, inventory, and delivery summary |
| Products | `/owner/products` | Manage products |
| Categories | `/owner/categories` | Manage product categories |
| Inventory | `/owner/inventory` | View stock, low stock, and expiry information |
| Suppliers | `/owner/suppliers` | Manage suppliers |
| Purchases | `/owner/purchase-orders` | Manage stock purchases |
| Online Orders | `/owner/orders` | Confirm, prepare, cancel, and assign orders |
| Deliveries | `/owner/deliveries` | Assign delivery agents and monitor delivery status |
| Walk-In Sales | `/owner/walk-in-sales` | Record physical shop sales |
| Reports | `/owner/reports` | View sales, inventory, order, and delivery reports |

### Delivery Agent Pages

| Page | Route | Description |
|---|---|---|
| Delivery Dashboard | `/delivery/dashboard` | Summary of assigned deliveries |
| Assigned Deliveries | `/delivery/assigned-orders` | List of assigned orders |
| Delivery Details | `/delivery/orders/[id]` | Customer address, contact details, and delivery update actions |

---

## API Modules

The application API is organized around the following modules:

| Module | Main Responsibilities |
|---|---|
| Authentication | Clerk user synchronization and role validation |
| Users | Customer profiles, owner accounts, delivery-agent accounts |
| Categories | Create, update, list, and deactivate categories |
| Products | Product CRUD operations, search, filtering, and availability |
| Inventory | Stock levels, adjustments, low-stock alerts, and expiry alerts |
| Suppliers | Supplier management |
| Purchases | Purchase orders, received stock, and product batches |
| Cart | Add items, update quantities, remove items, and view cart |
| Orders | Online checkout, stock validation, order management, and order history |
| Payments | Cash on Delivery payment records and collection status |
| Deliveries | Delivery assignment, delivery tracking, and status updates |
| Walk-In Sales | Physical-shop billing, sale records, and stock reduction |
| Reports | Daily sales, order, inventory, and delivery summaries |

---

## Security and Access Control

The system uses Clerk for authentication and session management.

- Customer registration is handled through Clerk Sign Up.
- Customer login is handled through Clerk Sign In.
- Clerk user IDs are linked with local PostgreSQL user records.
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
| H.N. Jayalath | Backend Developer + Database Administrator | PostgreSQL database, Prisma schema, backend APIs, inventory logic, order logic, Clerk integration, and role authorization |
| V.R. De Alwis Karunarathne | Frontend Developer | Owner portal, delivery-agent portal, dashboards, product management, order management, and delivery interfaces |
| K.A.H.B. Kasthuriarachchi | Frontend Developer | Customer portal, product browsing, authentication UI, cart, checkout, customer orders, and tracking pages |

---

## Project Management

The project is managed using Jira and is organized into the following development stages:

1. Project planning, requirement gathering, and system design
2. Database, Prisma schema, Clerk setup, and backend API development
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
- Printable PDF invoices and bills
- Advanced sales and profit reports
- Supplier payment and credit tracking
- Delivery route optimization
- Sinhala and Tamil language support
- Progressive Web App support
- Owner staff invitation system through email
- Product recommendations based on previous customer orders

---

## AI Usage Declaration

Lovable AI was used during the planning stage to explore UI ideas and create an initial sample prototype/wireframe. The generated code was not directly used as the final system implementation unless explicitly stated in project documentation.

The final project design, database schema, frontend implementation, backend logic, integration, testing, and documentation are developed and reviewed by the project team.

---

## License

This project was developed as a university group project for educational purposes.

All rights reserved by the Isumi Mart Project Team.
