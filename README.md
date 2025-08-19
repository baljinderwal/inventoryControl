# Inventory Management System Frontend

A modern, responsive web application for managing inventory, suppliers, orders, and more. Built with React, Vite, and Material-UI, this project provides a comprehensive solution for small to medium-sized businesses to track their assets and operations efficiently.

## 🚀 Getting Started

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

---

## ✨ Features

*   **🌐 Modern Animated Homepage:** A premium, responsive landing page to attract new users.
    *   **Hero Section:** With a catchy headline and clear call-to-action buttons.
    *   **Animated Features:** A feature carousel, individual feature sections with scroll-triggered animations, and a demo of the app's theming capabilities.
    *   **Engaging Content:** Includes a grid of the tech stack, a placeholder for a demo video, and a testimonials section.
    *   **Smooth Navigation:** A subtle, animated "scroll down" indicator on the hero section guides users to the content below.
*   **📊 Interactive Dashboard:** Get a quick overview of your business performance with key metrics and charts.
    *   **Sales & Revenue Analytics:** View total sales and revenue at a glance.
    *   **Sales Trends:** A dynamic line chart visualizes sales revenue over time.
    *   **Low Stock Alerts:** Immediately see which products are running low on stock.
*   **📦 Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for your products.
*   **🏢 Supplier Tracking:** Manage your suppliers and the products they provide.
*   **🚚 Order Processing:** Keep track of purchase orders and their statuses.
*   **📈 Stock Control with Batch and Expiry Tracking:**
    *   View and manage your current stock levels.
    *   Track products by batch number and expiry date.
    *   Deduct stock using FEFO (First-Expiring, First-Out) logic.
*   **🌐 Multi-Location Inventory Management:**
*   **⚡ Barcode Scanning for Efficiency:**
    *   **Accelerated Workflows:** Use a device's camera to scan product barcodes, significantly speeding up data entry.
    *   **Add to POs:** Quickly add items to a Purchase Order by scanning their barcodes.
    *   **Adjust Stock:** Streamline stock adjustments by scanning a product to bring up its adjustment form instantly.
    *   **Product Management:** Add and edit barcodes directly on the product management page.
*   **🤝 Customer & Sales Order Management:**
    *   **Full Customer CRM:** Add, edit, and manage a complete database of your customers.
    *   **Sales Order Processing:** Create, track, and manage orders from customers, from pending to completed.
    *   **Automated Stock Deduction:** Stock levels are automatically adjusted when a sales order is marked as completed.
*   **📝 Advanced Reporting Suite:**
    *   **Stock by Expiry Date:** A new report to identify items nearing their expiry date.
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

- **🔐 World-Class Login Experience:** A modern, beautiful, and highly functional login page designed for a seamless and secure user experience. It features:
    *   A focused, single-column layout with a vibrant, colorful background.
    *   Real-time inline validation with clear, instructive error messages.
    *   Helpful microinteractions like success checkmarks in fields and a "shake" animation for submission errors.
    *   Enhanced accessibility, including support for reduced motion preferences and Caps Lock detection.
    *   Progressive authentication options with UI for "Sign in with Google" and "Sign in with a passkey".

- **✨ World-Class Signup Page:** A sleek, professional, and user-friendly signup page designed to make account creation effortless and secure.
    *   **Clean, Minimalist Layout:** A mobile-first design that adapts beautifully to desktop, featuring a branding illustration alongside the form.
    *   **Comprehensive Form:** Includes fields for Full Name, Email, and Password.
    *   **Advanced Password Input:**
        *   **Password Strength Indicator:** A real-time visual bar that provides feedback on password complexity.
        *   **Show/Hide Toggle:** Allows users to verify their password entry.
    *   **Social Logins:** One-click signup options with Google, GitHub, and Apple to accelerate the process.
    *   **Trust and Transparency:** Includes links to Terms of Service/Privacy Policy and a security reassurance message to build user trust.
    *   **Seamless Integration:** The new page is available at the `/signup` route and is linked from the login page for easy discovery.

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
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── settings/
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
        *   `ApiModeToggle.jsx`: A UI switch component placed in the top bar that allows the user to toggle the application's data fetching mode between `local` (static file) and `api` (live server).
        *   `AppDialog.jsx`: A customizable modal dialog.
        *   `Button.jsx`: A styled button component.
        *   `ConfirmationDialog.jsx`: A specific dialog for "Are you sure?" prompts.
        *   `SearchBar.jsx`: A search input field.
        *   `StatsCard.jsx`: A card for displaying key metrics on the dashboard.
        *   `Table.jsx`: A reusable table component.
    *   `PrivateRoute.jsx`: A component that protects routes from unauthenticated access. It redirects to the login page if the user is not logged in.

*   **`pages/`**: Each subdirectory represents a major feature or page of the application.
    *   **`auth/LoginPage.jsx`**: A modern, feature-rich login page component.
    *   **`dashboard/DashboardPage.jsx`**: The main dashboard page, displaying stats and charts.
    *   ... (and so on for `suppliers`, `stock`, `products`, and `users`).
    *   **`reports/StockExpiryReport.jsx`**: A new report page that lists all inventory batches, sorted by the nearest expiry date. This is critical for managing perishable goods.

*   **`services/`**: Handles all API communication. Each service file is structured to export two objects: `local` and `api`. This allows the application to dynamically switch between fetching from a static JSON file (for read-only local mode) and a live API server.
    *   `api.js`: Creates a central `axios` instance with the base URL for the mock API.
    *   `productService.js`, `stockService.js`, etc.: These files contain the logic for both local and remote data operations for each feature.

*   **`utils/`**: Contains shared utilities and React contexts.
    *   `ApiModeContext.jsx`: A powerful development tool that manages the application's data fetching mode. It provides the rest of the application with the correct set of service functions (`local` or `api`) based on the user's selection from the `ApiModeToggle` component. It also persists the user's choice in `localStorage`.
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
    *   `/settings/locations`
*   **Admin** can access all pages, including:

## 🤖 Mock API and Data Model

The application uses `json-server` to simulate a backend API. The data is stored in `db.json`.

*   **`db.json`**: This file acts as a simple database. It contains several top-level keys (`products`, `suppliers`, `orders`, `stock`, `users`), each being an array of objects.
    *   **`products`**: `{id, name, sku, barcode, category, price, costPrice, lowStockThreshold}`
    *   **`suppliers`**: `{id, name, contact, email, products: [productId, ... ]}`
    *   **`orders`**: `{id, supplier: {id, name}, createdAt, status, products: [{productId, quantity}], completedAt?}`
    *   **`stock`**: `{id, productId, quantity, batches: [{batchNumber, expiryDate, quantity}]}`
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