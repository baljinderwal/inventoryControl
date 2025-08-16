# Inventory Management System Frontend

A modern, responsive web application for managing inventory, suppliers, orders, and more. Built with React, Vite, and Material-UI, this project provides a comprehensive solution for small to medium-sized businesses to track their assets and operations efficiently.

## ✨ Features

- **📊 Interactive Dashboard:** Get a quick overview of your business performance with key metrics and charts.
- **🔐 Authentication:** Secure, token-based authentication with backend integration. Supports both a mock local server and a live API.
- **📦 Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for your products.
- **🏢 Supplier Tracking:** Manage your suppliers and the products they provide.
- **🚚 Order Processing:** Keep track of purchase orders and their statuses.
- **📈 Stock Control with Batch and Expiry Tracking:** View and manage your current stock levels, track products by batch number and expiry date, and deduct stock using FEFO (First-Expiring, First-Out) logic.
- **🌐 Multi-Location Inventory Management:** Manage inventory across multiple locations with location-specific stock views and stock transfer capabilities.
- **⚡ Barcode Scanning for Efficiency:** Use a device's camera to scan product barcodes, significantly speeding up data entry for orders and stock adjustments.
- **🤝 Customer & Sales Order Management:** Full customer CRM and sales order processing, with automated stock deduction upon order completion.
- **📝 Advanced Reporting Suite:** A comprehensive set of reports including Sales History, Inventory Aging, Supplier Performance, and Profitability Analysis.
- **📄 CSV Data Export:** Export data from main pages and all reports to CSV format.
- **👤 User Administration & RBAC:** Manage users and their roles (Admin, Manager, Staff) with role-based access control.
- **🎨 Multi-Theme System:** A user-facing theme switcher with three professional themes (Light, Dark, Blue) and persistence via `localStorage`.

## 🔌 Backend & Authentication

This application features a sophisticated dual-mode system for its backend, allowing for both local development with a mock server and integration with a live production backend. A toggle switch is available in the top bar of the application to switch between these modes at any time.

### Development Modes

#### 🌳 Local Mode (Default)

-   **Backend**: Powered by `json-server`, which serves a static `db.json` file as a REST API. This is the default mode for out-of-the-box development.
-   **Authentication**: This mode uses a **mock authentication** system. The `login` and `signup` processes are simulated by reading from and writing to the `users` array in the `db.json` file.
-   **Usage**: To log in with pre-defined users, you can use the following credentials:
    *   **Admin:** `admin@example.com` / `password`
    *   **Manager:** `manager@example.com` / `password`
    *   **Staff:** `staff@example.com` / `password`

#### ☁️ API Mode

-   **Backend**: Connects to a live, external backend API for all data operations.
-   **Authentication**: This mode uses a full-featured, token-based authentication flow.
    -   **Signup**: New users are registered with the backend database. The backend prevents duplicate email registrations.
    -   **Login**: The application sends credentials to the backend, and upon success, receives a JSON Web Token (JWT).
    -   **Session Management**: The JWT is stored and sent with every subsequent request to access protected routes. The session is restored automatically when the app is reopened.

### Configuring the API Backend

To use the **API Mode**, you must configure the base URL of your backend.

1.  Create a new file named `.env.local` in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and change the `VITE_API_URL` variable to your backend's address:

    ```
    # The base URL for the backend API.
    # Make sure it includes the trailing slash.
    VITE_API_URL=https://your-backend-api.com/
    ```

    Vite will automatically load this environment variable.

## 🚀 Technologies Used

*   **React**: The core JavaScript library for building the user interface.
*   **Vite**: A next-generation frontend tooling system for fast development and builds.
*   **Material-UI (MUI)**: A comprehensive suite of UI tools to implement Google's Material Design.
*   **Framer Motion**: A production-ready motion library for React.
*   **TanStack Query (React Query)**: A powerful library for data fetching, caching, and server state management.
*   **React Router**: For declarative routing and navigation within the application.
*   **axios**: A promise-based HTTP client for making requests to the API.
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
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── db.json
└── package.json
```

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
3.  **Set up environment variables:**

    Copy the example environment file. This is required for the application to know which backend API to connect to when in 'API Mode'.
    ```bash
    cp .env.example .env.local
    ```
    If you are using a real backend, open `.env.local` and set the `VITE_API_URL` to your backend's URL.

### Running the Application

This project requires two terminals to be running simultaneously: one for the mock backend API (for Local Mode) and one for the frontend development server.

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

## 📜 Available Scripts

*   **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
*   **`npm run build`**: Compiles the application for production into the `dist` directory.
*   **`npm run lint`**: Lints the codebase using ESLint to check for errors and style issues.
*   **`npm run preview`**: Serves the production build from the `dist` directory for previewing.
*   **`npm run server`**: Starts the `json-server` to provide the mock API.