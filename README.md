# Inventory Management System Frontend

A modern, responsive web application for managing inventory, suppliers, orders, and more. Built with React, Vite, and Material-UI, this project provides a comprehensive solution for small to medium-sized businesses to track their assets and operations efficiently.

## ✨ Features

  **📊 Interactive Dashboard:** Get a quick overview of your business performance with key metrics and charts.
    *   **Sales & Revenue Analytics:** View total sales and revenue at a glance.
    *   **Sales Trends:** A dynamic line chart visualizes sales revenue over time.
    *   **Low Stock Alerts:** Immediately see which products are running low on stock.
*   **📦 Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for your products.
*   **🏢 Supplier Tracking:** Manage your suppliers and the products they provide.
*   **🚚 Order Processing:** Keep track of purchase orders and their statuses.
*   **📈 Stock Control:** A completely redesigned stock management page.
    *   View stock levels grouped by product.
    *   Expand each product to see a detailed breakdown of stock quantities across different locations.
    *   Adjust stock levels for a specific product at a specific location.
*   **🏢 Multi-Location Inventory Management:**
    *   **Location CRUD:** Add, edit, and delete inventory locations/warehouses through a new settings page.
    *   **Stock Transfers:** A dedicated page to transfer stock from one location to another, with validation to prevent transferring more stock than is available.
*   **📝 Advanced Reporting Suite:**
    *   **Location-Based Filtering:** The "Stock Value" and "Inventory Aging" reports can now be filtered by location.
    *   **Sales History:** Track sales trends over time.
    *   **Inventory Aging:** Identify slow-moving and obsolete stock.
    *   **Supplier Performance:** Evaluate supplier reliability and order history.
    *   **Profitability Analysis:** Analyze revenue, costs, and profit margins.
*   **📄 CSV Data Export:** Export data from main pages (Products, Orders, Suppliers) and all reports to CSV format for offline analysis.
*   **👤 User Administration:** Manage users and their roles within the system.
*   **🔐 Role-Based Access Control (RBAC):**
    *   **Admin:** Full access to all features, including user management.
    *   **Manager:** Access to all features except user management.
    *   **Staff:** Access to core features like dashboard, products, stock, and orders.
*   **🚀 Fast & Modern Tech:** Built with Vite for a lightning-fast development experience and React for a reactive UI.
*   **💅 Sleek UI:** A beautiful and intuitive user interface built with Material-UI.
*   **🔐 World-Class Login Experience:** A modern, beautiful, and highly functional login page designed for a seamless and secure user experience. It features:
    *   A focused, single-column layout with a vibrant, colorful background.
    *   Real-time inline validation with clear, instructive error messages.
    *   Helpful microinteractions like success checkmarks in fields and a "shake" animation for submission errors.
    *   Enhanced accessibility, including support for reduced motion preferences and Caps Lock detection.
    *   Progressive authentication options with UI for "Sign in with Google" and "Sign in with a passkey".


## 🚀 Technologies Used

*   **React**: The core JavaScript library for building the user interface.
*   **Vite**: A next-generation frontend tooling system for fast development and builds.
*   **Material-UI (MUI)**: A comprehensive suite of UI tools to implement Google's Material Design.
*   **TanStack Query (React Query)**: A powerful library for data fetching, caching, synchronization, and server state management.
*   **React Router**: For declarative routing and navigation within the application.
*   **axios**: A promise-based HTTP client for making requests to the mock API.
*   **Recharts**: A composable charting library built on React components.
*   **JSON Server**: To create a fake REST API for prototyping and development.

## 📦 Project Structure

The project follows a feature-based structure, which makes it scalable and easy to maintain.

```
/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── PrivateRoute.jsx
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── stock/
│   │   ├── suppliers/
│   │   └── users/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .eslintrc.js
├── .gitignore
├── db.json
├── index.html
├── package.json
└── vite.config.js
```

### File-by-File Breakdown (`src` directory)

*   **`main.jsx`**: The application's entry point. It renders the `App` component and wraps it with necessary context providers (`BrowserRouter`, `QueryClientProvider`, `AuthProvider`, `NotificationProvider`).
*   **`App.jsx`**: The root component that defines the application's routing structure using `react-router-dom`. It sets up the main layout and distinguishes between public (`/login`) and private routes.
*   **`index.css` / `App.css`**: Global stylesheets for the application.

*   **`components/`**: Contains reusable components used across multiple pages.
    *   **`layout/`**: Components that define the overall structure of the application.
        *   `Layout.jsx`: The main layout for protected pages, including the `Topbar` and `Sidebar`.
        *   `Sidebar.jsx`: The navigation sidebar with links to all the main pages.
        *   `Topbar.jsx`: The header bar of the application.
    *   **`ui/`**: Generic, reusable UI components.
        *   `AppDialog.jsx`: A customizable modal dialog.
        *   `Button.jsx`: A styled button component.
        *   `ConfirmationDialog.jsx`: A specific dialog for "Are you sure?" prompts.
        *   `SearchBar.jsx`: A search input field.
        *   `StatsCard.jsx`: A card for displaying key metrics on the dashboard.
        *   `Table.jsx`: A reusable table component.
    *   `PrivateRoute.jsx`: A component that protects routes from unauthenticated access. It redirects to the login page if the user is not logged in.

*   **`pages/`**: Each subdirectory represents a major feature or page of the application.
    *   **`auth/LoginPage.jsx`**: A modern, feature-rich login page component. It includes local form state management, inline validation, microinteractions, accessibility features, and support for progressive authentication methods.
    *   **`dashboard/DashboardPage.jsx`**: The main dashboard page, displaying stats and charts.
    *   **`orders/OrdersPage.jsx`**: Lists all orders.
    *   **`products/ProductsPage.jsx`**: The main page for product management, including the product table and controls for adding, editing, and deleting products.
    *   **`products/AddEditProductForm.jsx`**: The form used for adding and editing products.
    *   ... (and so on for `suppliers`, `stock`, `reports`, and `users`).

*   **`services/`**: Handles all API communication.
    *   `api.js`: Creates a central `axios` instance with the base URL for the mock API.
    *   `productService.js`, `supplierService.js`, etc.: These files contain functions for specific API calls (e.g., `getProducts`, `addProduct`), separating API logic from UI components.

*   **`utils/`**: Contains shared utilities and React contexts.
    *   `AuthContext.jsx`: Manages user authentication state (`isAuthenticated`, `login`, `logout`).
    *   `NotificationContext.jsx`: Provides a global system for showing snackbar notifications.

## ⚙️ Getting Started


### Prerequisites

Make sure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/en) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/inventory-frontend.git
    cd inventory-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

This project requires two terminals to be running simultaneously: one for the mock backend API and one for the frontend development server.

1.  **Start the mock API server:**
    In your first terminal, run the following command to start the `json-server`:
    ```bash
    npm run server
    ```
    This will start a mock API server on `http://localhost:3001`.

2.  **Start the frontend development server:**
    In your second terminal, run the following command:
    ```bash
    npm run dev
    ```
    This will start the Vite development server, and you can view the application by navigating to `http://localhost:5173` (or the URL provided in the terminal output).
## 🧑‍💻 Usage

### Authentication

The application features a login system with three predefined user roles. Use the following credentials to log in and explore the different access levels:

*   **Admin:**
    *   **Email:** `admin@example.com`
    *   **Password:** `password`
*   **Manager:**
    *   **Email:** `manager@example.com`
    *   **Password:** `password`
*   **Staff:**
    *   **Email:** `staff@example.com`
    *   **Password:** `password`

### Role-Based Access

*   **Staff** can access:
    *   `/` (Dashboard)
    *   `/products`
    *   `/stock`
    *   `/orders`
*   **Manager** can access everything a Staff member can, plus:
    *   `/suppliers`
    *   `/reports`
    *   `/reports/profitability`
*   **Admin** can access all pages, including:
    *   `/users`

## 🤖 Mock API and Data Model

The application uses `json-server` to simulate a backend API. The data is stored in `db.json`.

*   **`db.json`**: This file acts as a simple database. It contains several top-level keys (`products`, `suppliers`, `orders`, `stock`, `users`, `locations`, `sales`), each being an array of objects.
    *   **`products`**: `{id, name, sku, category, price, costPrice, lowStockThreshold, createdAt}`
    *   **`suppliers`**: `{id, name, contact, email, products: [productId, ... ]}`
    *   **`orders`**: `{id, supplier: {id, name}, createdAt, status, products: [{productId, quantity}], completedAt?}`
    *   **`stock`**: `{id, productId, quantity, locationId}`
    *   **`locations`**: `{id, name, address}`
    *   **`users`**: `{id, name, email, password, role}`
    *   **`sales`**: `{id, date, items: [{productId, productName, quantity, price, total}], totalRevenue}`

`json-server` automatically creates RESTful endpoints for each of these keys. For example, a `GET` request to `http://localhost:3001/products` will return all products.

## 📜 Available Scripts

*   **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
*   **`npm run build`**: Compiles the application for production into the `dist` directory.
*   **`npm run lint`**: Lints the codebase using ESLint to check for errors and style issues.
*   **`npm run preview`**: Serves the production build from the `dist` directory for previewing.
*   **`npm run server`**: Starts the `json-server` to provide the mock API.