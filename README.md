# Budget Wear Frontend

Frontend application for **Budget Wear**, a men's fashion e-commerce platform focused on a simple, fast, and mobile-friendly shopping experience.

Customers can browse products, select sizes, choose at least three different products, place Cash on Delivery orders, and receive an order confirmation.

An admin panel is also included for product, inventory, and order management.

---

## Features

### Customer Store

* Responsive men's fashion storefront
* Mobile-first UI
* Two-column product layout on mobile
* Product image preview
* Product name, description and price
* Size selection
* Stock availability
* Select product flow
* Minimum 3 different products requirement
* Selection toast notification
* Order form
* Cash on Delivery
* Order confirmation screen
* Order ID display
* Responsive footer
* Size guide modal

### Admin Panel

* Admin login
* JWT-based authentication
* Responsive sidebar
* Dashboard
* Product listing
* Add product
* Cloudinary image upload
* Edit product
* Soft-delete product
* Inventory management
* Size-wise stock update
* Order management
* Order status update
* Mobile-friendly admin UI

---

## Tech Stack

| Technology   | Purpose               |
| ------------ | --------------------- |
| Next.js      | React framework       |
| React        | UI development        |
| TypeScript   | Type safety           |
| Tailwind CSS | Styling               |
| Next Image   | Image optimization    |
| REST API     | Backend communication |
| Cloudinary   | Product image hosting |
| Vercel       | Deployment            |

---

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   └── inventory/
│   │       └── page.tsx
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
│
├── pages/
│   ├── home/
│   │   └── HomePage.tsx
│   │
│   └── admin/
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── products/
│       │   ├── ProductsPage.tsx
│       │   ├── AddProductPage.tsx
│       │   └── edit/
│       │       └── EditProductPage.tsx
│       ├── orders/
│       │   └── OrdersPage.tsx
│       └── inventory/
│           └── InventoryPage.tsx
│
├── components/
│   ├── Header.tsx
│   ├── InfoBar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── SelectionModal.tsx
│   ├── OrderForm.tsx
│   ├── OrderSuccess.tsx
│   ├── SizeGuideModal.tsx
│   │
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── AdminLoginForm.tsx
│       └── DashboardCard.tsx
│
├── lib/
│   └── api.ts
│
├── services/
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── product.service.ts
│   ├── inventory.service.ts
│   └── order.service.ts
│
└── types/
    ├── auth.ts
    ├── product.ts
    ├── cart.ts
    ├── dashboard.ts
    └── order.ts
```

---

# Routes

## Customer

Main storefront:

```text
/
```

---

## Admin

Admin login:

```text
/admin/login
```

Dashboard:

```text
/admin/dashboard
```

Products:

```text
/admin/products
```

Add product:

```text
/admin/products/add
```

Edit product:

```text
/admin/products/:id/edit
```

Orders:

```text
/admin/orders
```

Inventory:

```text
/admin/inventory
```

---

# Environment Variables

Create:

```text
.env.local
```

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

For production, configure the environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://budget-wear-backend.vercel.app/api
```

Do not commit secret environment files to Git.

---

# Installation

Clone the project and install dependencies:

```bash
npm install
```

---

# Development

Run the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

---

# Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# API Integration

The frontend communicates with the backend through:

```text
https://budget-wear-backend.vercel.app/api
```

Main API resources:

```text
/auth
/products
/inventory
/orders
/dashboard
```

---

# Product Selection Flow

Customers must select at least **3 different products** before placing an order.

Example:

```text
Product 1
    ↓
Selected 1

Product 2
    ↓
Selected 2

Product 3
    ↓
Selection Modal
    ↓
Buy Now
    ↓
Order Form
```

Changing the size of an already selected product does not count as selecting another product.

---

# Product Card

Each product card provides:

* Product image
* Product name
* Product price
* Product description
* Available sizes
* Size selection
* Stock availability
* Select Product button

Quantity is fixed to:

```text
1
```

for the current storefront flow.

---

# Order Flow

```text
Customer
   ↓
Browse Products
   ↓
Select Size
   ↓
Select 3+ Products
   ↓
Selection Modal
   ↓
Buy Now
   ↓
Order Form
   ↓
Cash on Delivery
   ↓
Place Order
   ↓
Order Success
   ↓
Order ID
```

---

# Admin Product Flow

```text
Admin Login
   ↓
Dashboard
   ↓
Products
   ↓
Add Product
   ↓
Select Image
   ↓
Product Information
   ↓
Size & Stock
   ↓
Create Product
   ↓
Backend
   ↓
Cloudinary
   ↓
Database
```

---

# Cloudinary Image Upload

Product images are uploaded from the admin panel.

```text
Admin
  ↓
Image File
  ↓
FormData
  ↓
Backend
  ↓
Cloudinary
  ↓
imageUrl
  ↓
Database
```

The frontend never manually enters the Cloudinary URL.

---

# Responsive Design

The application is designed mobile-first.

### Customer Store

```text
Mobile
2-column product grid

Tablet
2-column product grid

Desktop
3-column product grid
```

### Admin

```text
Desktop
Fixed sidebar

Mobile
Sidebar drawer
```

Touch-friendly buttons and inputs are used throughout the mobile interface.

---

# Branding

Brand:

```text
Budget Wear
```

Primary color:

```text
#EB1D25
```

Primary hover color:

```text
#C9151C
```

Main background:

```text
#F8FAFC
```

Surface:

```text
#FFFFFF
```

---

# UI Principles

The frontend follows these principles:

* Mobile-first
* Fast interactions
* Clean navigation
* Minimal unnecessary animations
* Large touch targets
* Clear product hierarchy
* Simple checkout flow
* Consistent colors
* Responsive layouts
* Accessible form controls

---

# Production Deployment

The frontend is deployed on Vercel.

Production URL:

```text
https://budget-wear.vercel.app
```

Backend:

```text
https://budget-wear-backend.vercel.app
```

API:

```text
https://budget-wear-backend.vercel.app/api
```

Make sure the Vercel environment variable is configured:

```env
NEXT_PUBLIC_API_URL=https://budget-wear-backend.vercel.app/api
```

After changing environment variables, redeploy the project.

---

# Important Production Configuration

The backend must allow the production frontend origin:

```text
https://budget-wear.vercel.app
```

The frontend must point to:

```text
https://budget-wear-backend.vercel.app/api
```

---

# Useful Commands

### Start development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start production

```bash
npm start
```

### Check Git status

```bash
git status
```

### Commit changes

```bash
git add .
git commit -m "update frontend"
```

### Push

```bash
git push
```

---

# Deployment Checklist

Before production deployment:

```text
✓ NEXT_PUBLIC_API_URL configured
✓ Backend deployed
✓ Backend API working
✓ CORS configured
✓ Product images loading
✓ Product selection working
✓ 3-product rule working
✓ Order form working
✓ Order submission working
✓ Order success working
✓ Admin login working
✓ Admin dashboard working
✓ Product CRUD working
✓ Inventory update working
✓ Order status update working
✓ Mobile UI tested
✓ npm run build successful
```

---

# Author

**Budget Wear**

Men's fashion e-commerce storefront and admin management system.

Built with:

```text
Next.js
React
TypeScript
Tailwind CSS
REST API
Cloudinary
Vercel
```
