# Codebase Explanation: Inventory Management Frontend

This document provides a detailed, file-by-file explanation of the `inventory-frontend` application.

## 1. High-Level Overview

This repository contains a React-based web application for inventory management. The main application is located inside the `inventory-frontend/` directory. The top-level files are mostly boilerplate code from the initial project setup.

The `inventory-frontend` application uses the following technologies:
*   **Vite**: A fast build tool for modern web projects.
*   **React**: The core library for building the user interface.
*   **Material-UI (MUI)**: A component library for a consistent look and feel.
*   **TanStack Query (React Query)**: A library for data fetching, caching, and state management.
*   **React Router**: For handling navigation between pages.
*   **axios**: A library for making HTTP requests to the backend API.
*   **json-server**: A tool to create a fake REST API from a JSON file for development.

---

## 2. Configuration and Backend Mocking

*   **`vite.config.js`**: The configuration file for Vite. It primarily enables the React plugin, which allows Vite to compile JSX and provide features like Fast Refresh.

*   **`package.json`**: Defines the project's metadata, dependencies (`react`, `@mui/material`), dev dependencies (`vite`, `eslint`), and scripts. Key scripts include `dev` (start dev server), `build` (create production build), and `server` (start the mock API).

*   **`db.json` and `json-server`**: The application simulates a backend using `json-server`.
    *   **`db.json`**: Acts as a simple database, containing JSON data for `products`, `suppliers`, and `stock`.
    *   The `"server"` script (`json-server --watch db.json --port 3001`) starts a mock REST API based on `db.json`, available at `http://localhost:3001`.

---

## 3. Application Entry Point

*   **`index.html`**: The main HTML file. It contains a `<div id="root"></div>` where the React app is rendered, and a `<script>` tag that loads `src/main.jsx`.

*   **`src/main.jsx`**: The heart of the application's setup. It renders the main `App` component into the `root` div and wraps it with several "Providers" to give the entire application access to routing (`BrowserRouter`), data fetching (`QueryClientProvider`), theming (`ThemeProvider`), authentication (`AuthProvider`), and notifications (`NotificationProvider`).

---

## 4. Routing and Layout

*   **`src/App.jsx`**: Defines the application's URL structure using `<Routes>` and `<Route>`. It sets up a public `/login` route and a set of protected routes wrapped in a `PrivateRoute` component.

*   **`src/components/PrivateRoute.jsx`**: Acts as a gatekeeper for protected routes. It uses the `useAuth` hook to check if the user is authenticated. If yes, it renders the requested page; if not, it redirects to `/login`.

*   **`src/components/layout/Layout.jsx`**: Defines the persistent UI shell for all protected pages. It includes the `Topbar` (header) and `Sidebar` (navigation), and renders the specific page content via an `<Outlet />` component from React Router.

---

## 5. Services and State Management

*   **`src/services/`**: This directory handles all API communication.
    *   **`api.js`**: Creates a central `axios` instance with the base URL for the mock API.
    *   **`productService.js`, `supplierService.js`, etc.**: These files define specific functions for API calls (e.g., `getProducts`, `addProduct`). This keeps API logic separate from UI components.

*   **`src/utils/`**: This directory contains shared utilities and state management contexts.
    *   **`AuthContext.jsx`**: Manages user authentication state (`isAuthenticated`, `login`, `logout`) and makes it available to the entire app via the `useAuth` hook.
    *   **`NotificationContext.jsx`**: Provides a global system for showing snackbar notifications via the `useNotification` hook.

---

## 6. Reusable UI Components

The `src/components/ui/` directory contains generic, reusable components to ensure consistency and reduce code duplication.
*   **`Table.jsx`**: A wrapper around the Material-UI `Table` that accepts `headers` and `data` props, making it easy to render tables anywhere.
*   **`AppDialog.jsx`**: A generic modal dialog component.
*   **`ConfirmationDialog.jsx`**: A specific dialog for "Are you sure?" prompts.
*   **`SearchBar.jsx`**: A styled search input field.
*   **`StatsCard.jsx`**: A card for displaying key metrics on the dashboard.

---

## 7. Pages (Feature by Feature)

*   **Dashboard (`/`)**: The landing page after login. It displays summary statistics using `StatsCard` components and a chart using the `recharts` library. (Currently uses hardcoded data).

*   **Products (`/products`)**: A full CRUD interface for managing products.
    *   `ProductsPage.jsx`: Lists all products in the `MuiTable`, with search and buttons for add/edit/delete. Fetches data using `useQuery`.
    *   `AddEditProductForm.jsx`: A form for adding or editing products, rendered in an `AppDialog`. Uses `useMutation` to save changes and invalidate the `products` query to refresh the list.

*   **Stock (`/stock`)**: Allows viewing and adjusting stock levels.
    *   `StockPage.jsx`: Lists products with their stock levels, highlighting low-stock items.
    *   `StockAdjustmentForm.jsx`: A form for increasing or decreasing stock for a product, with "Stock In" and "Stock Out" buttons. Uses `useMutation` to update the stock level.

*   **Suppliers (`/suppliers`)**: A CRUD interface for managing suppliers, structured identically to the Products page, demonstrating good code reuse.

*   **Reports (`/reports`)**: A page for generating and exporting data.
    *   `ReportsPage.jsx`: Calculates the total inventory value. It uses the `@json2csv/plainjs` library to allow the user to download the detailed report as a CSV file.

*   **Login (`/login`)**: A simple, public sign-in page. It uses the `AuthContext` to call the `login` function and navigates the user to the dashboard on submission. (Note: It's a mock login and doesn't perform real validation).

---

## 8. Final Summary

The application follows modern, best-practice React development patterns. It has a clear and logical structure that separates concerns effectively, making it maintainable and easy to understand. The flow from a user request to a rendered page is well-defined, involving routing, data fetching, and the composition of reusable UI components.
