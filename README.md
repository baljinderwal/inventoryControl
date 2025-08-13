# Inventory Management System Frontend

This is a comprehensive, feature-rich frontend for an Inventory Management System, built with React. It provides a user-friendly interface for managing products, suppliers, stock, and orders. The application is designed to be a single-page application (SPA) and uses a mock backend for development and demonstration purposes.

## ✨ Features

*   **Dashboard**: A central hub displaying key statistics like total products, total suppliers, and inventory value. It also features a chart visualizing stock levels.
*   **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products. Users can add, edit, and delete products, as well as search for specific items.
*   **Supplier Management**: Full CRUD functionality for suppliers.
*   **Stock Management**: View current stock levels for all products, with visual indicators for low-stock items. Users can adjust stock quantities with "Stock In" and "Stock Out" actions.
*   **Order Management**: View a list of all orders, with details about the supplier, creation date, and status.
*   **Reporting**: Generate and view reports, starting with a Profitability Report that details the cost, price, and profit margin for each product.
*   **User Authentication**: A mock login system to simulate user authentication and protect application routes.
*   **Notifications**: A global notification system to provide feedback to the user on their actions (e.g., "Product added successfully").

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
    *   **`auth/LoginPage.jsx`**: The login page component.
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

*   [Node.js](https://nodejs.org/) (v14 or later)
*   [npm](https://www.npmjs.com/) (v6 or later)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd inventory-frontend
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Application

This project requires two processes to be running simultaneously: the frontend development server and the mock API server.

1.  **Start the mock API server:**
    Open a terminal and run:
    ```sh
    npm run server
    ```
    This will start the `json-server` on `http://localhost:3001`.

2.  **Start the frontend development server:**
    Open a second terminal and run:
    ```sh
    npm run dev
    ```
    This will start the Vite development server on `http://localhost:5173` (or another port if 5173 is in use).

Now, you can open your browser and navigate to `http://localhost:5173` to see the application in action.

## 🤖 Mock API and Data Model

The application uses `json-server` to simulate a backend API. The data is stored in `db.json`.

*   **`db.json`**: This file acts as a simple database. It contains several top-level keys (`products`, `suppliers`, `orders`, `stock`, `users`), each being an array of objects.
    *   **`products`**: `{id, name, sku, category, price, costPrice, stock, lowStockThreshold}`
    *   **`suppliers`**: `{id, name, contact, email, products: [productId, ... ]}`
    *   **`orders`**: `{id, supplier: {id, name}, createdAt, status, products: [{productId, quantity}], completedAt?}`
    *   **`stock`**: `{id, productId, quantity, warehouse}`
    *   **`users`**: `{id, name, email, password, role}`

`json-server` automatically creates RESTful endpoints for each of these keys. For example, a `GET` request to `http://localhost:3001/products` will return all products.

## 📜 Available Scripts

*   **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
*   **`npm run build`**: Compiles the application for production into the `dist` directory.
*   **`npm run lint`**: Lints the codebase using ESLint to check for errors and style issues.
*   **`npm run preview`**: Serves the production build from the `dist` directory for previewing.
*   **`npm run server`**: Starts the `json-server` to provide the mock API.
