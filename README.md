# Printing House – Web Platform for Print Shops

A full-stack web application that connects clients with print shops. Clients can browse and order printed products (business cards, flyers, posters, roll-ups, T-shirts, mugs…), and print shops manage their catalog and orders. It also has a **public procurement** module where clients post tenders and print shops compete with bids.

Built as a project for the *Internet Application Programming* course at the School of Electrical Engineering, University of Belgrade.

## Tech stack

- **Frontend:** Angular 20 (standalone components, route guards, HTTP interceptors), Bootstrap 5, Chart.js
- **Backend:** Node.js, Express, TypeScript, REST API
- **Database:** MongoDB with Mongoose
- **Other:** JWT authentication, bcrypt password hashing, Multer file uploads, PDFKit (PDF reports), Nodemailer (email notifications)

## Features

The app has three user roles, each with its own protected routes on both the backend and the frontend.

**Client**
- Search and filter products by category, and view product details with a gallery and comments
- Customize a product before ordering (quantity, options, uploaded design), then use the cart and checkout
- View order history and archive
- Post public procurements (tenders) and pick the winning print-shop bid

**Print shop**
- Manage a product catalog (add or edit products and images) and update stock quantities
- Bulk-import products from a JSON file
- Process incoming orders
- Bid on public procurements; PDF reports of each procurement are generated and emailed

**Administrator**
- Approve or reject new user registrations
- Manage users and product categories
- View a statistics dashboard with charts

## Project structure

```
backend/    Express + TypeScript REST API (controllers, routers, models, middleware, services)
frontend/   Angular application (client, printer, admin, auth, public modules)
seed/       Script and JSON export for populating MongoDB with demo data
```

## Running locally

Requirements: Node.js 20+ and a local MongoDB instance.

```bash
# 1. Database (demo data)
cd seed
node seed.js            # or import the JSON files in seed/database-export with mongoimport

# 2. Backend  (http://localhost:4000)
cd backend
cp .env.example .env    # adjust values if needed
npm install
npm run dev

# 3. Frontend (http://localhost:4200)
cd frontend
npm install
npm start
```
