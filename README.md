# Inventory Management System

A modern, responsive web application for managing inventory, suppliers, orders, and more. Built with React, Vite, and Material-UI, this project provides a comprehensive solution for small to medium-sized businesses to track their assets and operations efficiently.

## ✨ Key Features

*   **📊 Interactive Dashboard:** Get a quick overview of your inventory status with key metrics, charts, and low-stock alerts.
*   **📦 Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for your products.
*   **🏢 Supplier Tracking:** Manage your suppliers and the products they provide.
*   **🚚 Purchase Order Management:**
    *   Create, manage, and track purchase orders (POs) sent to suppliers.
    *   **Smart Suggestions:** Get recommendations for products to reorder based on low-stock alerts.
    *   **Automated Stock Reconciliation:** Automatically update product stock levels when a PO is marked as "Received".
*   **📈 Stock Control:** View and manage your current stock levels.
*   **📝 Advanced Reporting Suite:**
    *   **Sales History:** Track sales trends over time.
    *   **Inventory Aging:** Identify slow-moving and obsolete stock.
    *   **Supplier Performance:** Evaluate supplier reliability and order history.
    *   **Profitability Analysis:** Analyze revenue, costs, and profit margins.
*   **📄 Data Export:**
    *   **PDF Generation:** Generate a professional PDF for any purchase order to send to suppliers.
    *   **CSV Export:** Export data from main pages and all reports to CSV format for offline analysis.
*   **👤 User Administration:** Manage users and their roles within the system.
*   **🔐 Role-Based Access Control (RBAC):**
    *   **Admin:** Full access to all features, including user management.
    *   **Manager:** Access to all features except user management.
    *   **Staff:** Access to core features like dashboard, products, stock, and orders.
*   **🚀 Fast & Modern Tech:** Built with Vite for a lightning-fast development experience and React for a reactive UI.
*   **💅 Sleek UI:** A beautiful and intuitive user interface built with Material-UI.

## 🛠️ Tech Stack & Libraries

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/) for routing
    *   [Material-UI](https://mui.com/) for UI components
    *   [Recharts](https://recharts.org/) for charts
*   **Data Fetching & State Management:**
    *   [React Query](https://tanstack.com/query/latest) for server state management and caching
    *   [Axios](https://axios-http.com/) for making HTTP requests
*   **Mock Backend:**
    *   [JSON Server](https://github.com/typicode/json-server) for a quick and easy mock REST API.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

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
    *   `/purchase-orders`
*   **Manager** can access everything a Staff member can, plus:
    *   `/suppliers`
    *   `/reports`
    *   `/reports/profitability`
*   **Admin** can access all pages, including:
    *   `/users`

## 📂 Project Structure

Here is a high-level overview of the project's directory structure:

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable React components
│   │   ├── layout/      # Main layout components (Sidebar, Topbar)
│   │   └── ui/          # Generic UI elements (Button, Table, etc.)
│   ├── pages/           # Top-level page components for each route
│   ├── services/        # API call definitions (e.g., poService.js)
│   └── utils/           # Utility functions and React contexts (e.g., generatePOPDF.js)
├── .eslintrc.cjs        # ESLint configuration
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
