# Inventory Management System Frontend

A modern, responsive web application for managing inventory, suppliers, orders, and more. Built with React, Vite, and Material-UI, this project provides a comprehensive solution for small to medium-sized businesses to track their assets and operations efficiently.

## ✨ Features

- **📊 Interactive Dashboard:** Get a quick overview of your business performance with key metrics and charts.
- **📦 Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for your products.
- **🏢 Supplier Tracking:** Manage your suppliers and the products they provide.
- **🚚 Order Processing:** Keep track of purchase orders and their statuses.
- **📈 Stock Control with Batch and Expiry Tracking:** View and manage your current stock levels, track products by batch number and expiry date, and deduct stock using FEFO (First-Expiring, First-Out) logic.
- **🌐 Multi-Location Inventory Management:** Manage locations, view location-specific stock, transfer stock between locations, and filter reports by location.
- **⚡ Barcode Scanning for Efficiency:** Use a device's camera to scan product barcodes to accelerate workflows like adding items to purchase orders and adjusting stock.
- **🤝 Customer & Sales Order Management:** A full customer CRM with sales order processing and automated stock deduction.
- **📝 Advanced Reporting Suite:** A comprehensive set of reports including Stock by Expiry Date, Sales History, Inventory Aging, Supplier Performance, and Profitability Analysis.
- **📄 CSV Data Export:** Export data from main pages and all reports to CSV format.
- **👤 User Administration:** Manage users and their roles within the system.
- **🔐 Role-Based Access Control (RBAC):** Predefined roles (Admin, Manager, Staff) with different levels of access.
- **🚀 Fast & Modern Tech:** Built with Vite for a lightning-fast development experience and React for a reactive UI.

---

### 🎨 Advanced Theming & UI

- **💎 World-Class Navigation Sidebar:** A highly interactive and responsive sidebar for a premium user experience.
  - **Collapsible & Persistent:** The sidebar can be collapsed to an icon-only view, and its state is saved in `localStorage` across sessions.
  - **Responsive Design:** Transitions seamlessly from a fixed permanent drawer on desktop to a swipeable drawer on mobile.
  - **Animated & Interactive:** Built with a combination of MUI transitions and Framer Motion for fluid animations, including a one-time staggered item reveal and hover effects.
  - **Accessible:** Includes tooltips for collapsed icons and full keyboard navigation support.

- **🎨 Multi-Theme System:** A user-facing theme switcher that allows for complete personalization of the application's appearance.
  - **Theme Switcher:** A dropdown menu in the `Topbar` allows users to select their preferred theme.
  - **Persistent Choice:** The user's selected theme is saved to `localStorage` and applied on subsequent visits.
  - **Three Professional Themes:**
    1.  **Professional Light:** A clean, bright theme with an indigo primary color.
    2.  **Sleek Dark:** A modern dark theme with a slate background and vibrant accents.
    3.  **Soothing Blue:** A light theme with calming blue hues.

- **🔐 World-Class Login Experience:** A modern, beautiful, and highly functional login page designed for a seamless and secure user experience.

---

## 🚀 Technologies Used

*   **React**: The core JavaScript library for building the user interface.
*   **Vite**: A next-generation frontend tooling system for fast development and builds.
*   **Material-UI (MUI)**: A comprehensive suite of UI tools to implement Google's Material Design.
*   **Framer Motion**: A production-ready motion library for React.
*   **TanStack Query (React Query)**: A powerful library for data fetching, caching, synchronization, and server state management.
*   **React Router**: For declarative routing and navigation within the application.
*   **axios**: A promise-based HTTP client for making requests to the mock API.
*   **Recharts**: A composable charting library built on React components.
*   **`react-zxing`**: A React hook for barcode scanning using the ZXing library.
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
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
...
```

### File-by-File Breakdown (`src` directory)

*   **`main.jsx`**: The application's entry point. It defines all three application themes, wraps the app in all necessary context providers (including the new `CustomThemeProvider`), and renders the `App` component.
*   **`App.jsx`**: The root component that defines the application's routing structure. It's wrapped by the `SidebarProvider` to enable sidebar state management.
*   **`components/`**: Contains reusable components.
    *   **`layout/`**: Components that define the application's chrome.
        *   `Layout.jsx`: The main layout for protected pages. It arranges the `Topbar`, `Sidebar`, and the main content area (`Outlet`).
        *   `Sidebar.jsx`: A world-class, responsive, and animated navigation component. It is collapsible, persists its state, adapts for mobile, and is styled to sit below the `Topbar`.
        *   `Topbar.jsx`: The full-width header bar of the application. It contains the sidebar toggle, the new `ThemeSwitcher` component, and the user account menu.
    *   **`ui/`**: Generic, reusable UI components.
        *   `ThemeSwitcher.jsx`: A new dropdown component that allows the user to select a theme.
        *   `StatsCard.jsx`: A restyled card for displaying key metrics on the dashboard, designed to adapt to the selected theme.
        *   `Button.jsx`: A custom button component built on top of MUI's `Button` that respects the application's theme.
*   **`utils/`**: Contains shared utilities and React contexts.
    *   **`ThemeContext.jsx`**: A new context to manage the currently active theme and persist the user's choice.
    *   `SidebarContext.jsx`: A context to manage the collapsed state of the sidebar.
    *   ... (other contexts and utils)

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
    *   `/settings/locations`
*   **Admin** can access all pages, including:
    *   `/users`
    *   `/settings/locations`

## 🤖 Mock API and Data Model

The application uses `json-server` to simulate a backend API. The data is stored in `db.json`.

*   **`db.json`**: This file acts as a simple database. It contains several top-level keys (`products`, `suppliers`, `orders`, `stock`, `users`), each being an array of objects.
    *   **`products`**: `{id, name, sku, barcode, category, price, costPrice, lowStockThreshold}`
    *   **`suppliers`**: `{id, name, contact, email, products: [productId, ... ]}`
    *   **`orders`**: `{id, supplier: {id, name}, createdAt, status, products: [{productId, quantity}], completedAt?}`
    *   **`stock`**: `{id, productId, quantity, locationId, batches: [{batchNumber, expiryDate, quantity}]}`
    *   **`locations`**: `{id, name, address}`
    *   **`users`**: `{id, name, email, password, role}`
    *   **`sales`**: `{id, date, items: [{productId, productName, quantity, price, total}], totalRevenue}`
    *   **`customers`**: `{id, name, email, phone, address}`
    *   **`salesOrders`**: `{id, customerId, customerName, createdAt, status, items: [{productId, productName, quantity, price}], total}`

`json-server` automatically creates RESTful endpoints for each of these keys. For example, a `GET` request to `http://localhost:3001/products` will return all products.

## 📜 Available Scripts

*   **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
*   **`npm run build`**: Compiles the application for production into the `dist` directory.
*   **`npm run lint`**: Lints the codebase using ESLint to check for errors and style issues.
*   **`npm run preview`**: Serves the production build from the `dist` directory for previewing.
*   **`npm run server`**: Starts the `json-server` to provide the mock API.