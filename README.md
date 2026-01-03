
<div align="center">
  <img src="client/src/assets/img/chocolate.png" alt="System Logo" width="200"/>
  
  <br><br>

  <h1>Wonka Factory: Distributed Chocolate Manufacturing & Retail Management System</h1>
  <h3>Full-Stack Web Application for Confectionery Supply Chain & B2C Commerce</h3>

  <p>
    <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/Frontend-Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js"/>
    <img src="https://img.shields.io/badge/Architecture-REST_API-0052CC?style=for-the-badge&logo=ark-ecosystem&logoColor=white" alt="REST Architecture"/>
    <img src="https://img.shields.io/badge/Status-Production_Ready-red?style=for-the-badge" alt="Status"/>
  </p>

  <p>
    <strong>A centralized, multi-tenant digital ecosystem engineered to orchestrate the lifecycle of chocolate production, facility management, inventory logistics, and consumer engagement.</strong>
  </p>

  <p>
    <a href="Specifikacija_projektnog_zadatka.pdf"><strong>📄 View Official Specification (PDF) »</strong></a>
  </p>
</div>

---

## Project Overview

**Wonka Factory** is a sophisticated web-based platform designed to bridge the gap between chocolate manufacturing facilities and the end consumer. Unlike standard e-commerce solutions, this system introduces a complex hierarchical management structure that digitizes the operations of physical factories.

The system solves the problem of decentralized inventory and sales management by providing a unified interface where:
1.  **Administrators** oversee the entire network of factories and personnel.
2.  **Managers** operate individual facilities, curating product lines and managing workforce logistics.
3.  **Workers** maintain real-time inventory levels.
4.  **Customers** engage in a gamified purchasing experience with loyalty rewards.

This solution is engineered to operate without a traditional Relational Database Management System (RDBMS), utilizing a high-performance, file-based persistence layer to ensure data portability and integrity in constrained environments.

## Motivation and Background

The genesis of **Wonka Factory** stems from the requirement to model complex real-world business logic within a strictly defined software architecture. The project serves as a practical implementation of advanced software engineering principles, specifically focusing on:

*   **Role-Based Access Control (RBAC):** Implementing strict security policies across four distinct user roles.
*   **State Machine Logic:** Managing the complex states of purchase orders (Processing, Approved, Rejected, Cancelled).
*   **Algorithmic Business Logic:** Implementing dynamic pricing, loyalty point calculations, and suspicious user detection algorithms.
*   **NoSQL Data Persistence:** Demonstrating the capability to architect a robust Data Access Object (DAO) layer using JSON serialization, bypassing the need for external database dependencies.

## Key Features

### 1. Multi-Tiered User Management
 The system implements a rigid hierarchy with distinct capabilities:
*   **Administrator:** Global system control, factory instantiation, manager appointment, and "suspicious user" auditing/blocking.
*   **Manager:** Facility-level administration, worker recruitment, inventory cataloging, and comment moderation.
*   **Worker:** Operational execution, specifically regarding stock level adjustments.
*   **Customer:** End-user interaction, purchasing, and loyalty tier progression.

### 2. Factory & Inventory Lifecycle
*   **Factory Instantiation:** Administrators can commission new factories, assigning unique logos, geolocation data, and managerial staff.
*   **Inventory Control:** Managers define product specifications (type, weight, composition), while workers execute real-time quantity updates.
*   **Geospatial Integration:** Integration with **OpenLayers** provides interactive map visualizations for factory locations.

### 3. Advanced E-Commerce Engine
*   **Dynamic Cart Management:** Real-time stock validation ensures users cannot reserve inventory exceeding available quantities.
*   **Order Processing Pipeline:** Orders transition through a strictly defined lifecycle. Managers possess final approval authority, ensuring quality control.
*   **Cancellation Logic:** Users may cancel pending orders, triggering a penalty algorithm that impacts their loyalty standing.

### 4. Loyalty & Gamification System
The system features a proprietary algorithm for customer retention:
*   **Point Accumulation:** `Points = (Order Price / 1000) * 133`
*   **Penalty Calculation:** `Lost Points = (Order Price / 1000) * 133 * 4`
*   **Tiered Status:** Users automatically graduate between Bronze, Silver, and Gold tiers based on point thresholds, unlocking specific discount percentages.

### 5. Algorithmic Search & Filtering
A highly optimized search engine allows users to query factories and products based on:
*   **Textual Matches:** Factory name, chocolate name.
*   **Geolocation:** City or country.
*   **Rating:** Average review scores.
*   **Sorting:** Ascending/Descending sorts by name, location, or rating.
*   **Filtering:** By chocolate type (Dark, Milk, White) and factory operational status (Open/Closed).

### 6. Security & Moderation
*   **Suspicious Activity Detection:** The system automatically flags users who cancel more than five orders within a 30-day sliding window.
*   **Comment Moderation:** Customer reviews remain hidden until explicitly approved by the facility manager.
*   **User Blocking:** Administrators can permanently revoke system access for flagged accounts.

## Architecture and Design

The application follows a strictly decoupled **Client-Server Architecture**, adhering to **RESTful** principles.

### High-Level Components

1.  **Presentation Layer (Frontend):**
    Built with **Vue.js**, the frontend provides a reactive, Single Page Application (SPA) experience. It communicates with the backend via asynchronous HTTP requests (AJAX/Fetch). The UI is component-based, ensuring modularity and reusability.

2.  **Application Layer (Backend):**
    Powered by **Node.js**, the server acts as the central orchestrator. It handles routing, authentication, business logic execution, and data serialization.

3.  **Data Persistence Layer:**
    In compliance with the project constraints, the system utilizes a custom file-based storage engine. Data is serialized into JSON format and stored in flat files. A Repository Design Pattern is employed to abstract file I/O operations, making the data access layer indistinguishable from a traditional database driver to the upper layers of the application.

### Data Flow
`User Action` -> `Vue Component` -> `REST API Call` -> `Node Controller` -> `Service Layer (Business Logic)` -> `Repository Layer` -> `JSON File Storage`

## Technology Stack

### Backend
*   **Runtime:** **Node.js** - Chosen for its non-blocking I/O capabilities, essential for handling concurrent user requests in a single-threaded environment.
*   **Framework:** **Express.js** (or similar lightweight framework) - Used to streamline routing and middleware integration.
*   **Authentication:** JWT (JSON Web Tokens) or Session-based auth for stateless/stateful user management.

### Frontend
*   **Framework:** **Vue.js** - Selected for its lightweight footprint and two-way data binding.
*   **Mapping:** **OpenLayers** - An open-source, high-performance library for rendering dynamic maps.
*   **Styling:** CSS3 with responsive design principles (Flexbox/Grid).

### Tools
*   **Version Control:** Git (GitLab).
*   **API Testing:** Postman.
*   **IDE:** Visual Studio Code.

## Project Structure

The directory structure is organized to promote separation of concerns and maintainability.

```text
Wonka Factory/
├── client/                 # Frontend Application (Vue.js)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, global styles
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page-level components
│   │   ├── services/       # API integration modules
│   │   ├── router/         # Vue Router configuration
│   │   └── App.vue         # Root component
│   └── package.json
├── server/                 # Backend Application (Node.js)
│   ├── data/               # JSON storage files (The "Database")
│   │   ├── users.json
│   │   ├── factories.json
│   │   ├── chocolates.json
│   │   └── orders.json
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic layer
│   │   ├── repositories/   # Data access layer (File I/O)
│   │   ├── models/         # Data transfer objects
│   │   └── utils/          # Helper functions
│   ├── app.js              # Entry point
│   └── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
*   **Node.js** (v14.0.0 or higher)
*   **npm** (Node Package Manager)

### Step-by-Step Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/bteodora/choco-factory-app.git
    ```

2.  **Backend Configuration**
    Navigate to the server directory and install dependencies.
    ```bash
    cd server
    npm install
    ```
    *Note: Ensure the `data/` directory has write permissions.*

3.  **Frontend Configuration**
    Navigate to the client directory and install dependencies.
    ```bash
    cd ../client
    npm install
    ```

4.  **Running the Application**
    *   **Start the Backend:**
        ```bash
        # Inside /server directory
        npm start
        ```
        The server will initialize on port `3000` (default).

    *   **Start the Frontend:**
        ```bash
        # Inside /client directory
        npm run serve
        ```
        The application will be accessible at `http://localhost:8080`.

## Usage Guide

### Initial Access
Upon first launch, the system relies on pre-configured Administrator credentials (loaded from `users.json`).
*   **Username:** `admin`
*   **Password:** `admin`

### Creating a Factory (Admin Workflow)
1.  Log in as Administrator.
2.  Navigate to the "Create Factory" dashboard.
3.  Enter factory details (Name, Working Hours).
4.  Select a location on the OpenLayers map.
5.  Assign a Manager (create a new account if no free managers exist).
6.  Submit. The factory immediately appears in the public search index.

### Purchasing Process (Customer Workflow)
1.  Register a new account.
2.  Browse factories and select products.
3.  Add items to the cart (quantity is validated against stock).
4.  Proceed to checkout.
5.  Monitor order status in the profile section.
6.  Once approved, points are credited to the loyalty balance.

## Error Handling and Edge Cases

The application employs defensive programming techniques to maintain stability:

*   **Concurrency Control:** Although file-based, the backend manages read/write streams to prevent data corruption during simultaneous accesses.
*   **Input Validation:** All incoming data is sanitized. Quantities cannot be negative; dates must be valid; coordinates must be within geographical bounds.
*   **Orphaned Data:** Deletion is logical. Entities are marked as "deleted" rather than physically removed, preserving referential integrity for historical orders.

## Performance Considerations

*   **File I/O Optimization:** To mitigate the slowness of disk operations, frequently accessed data (like User sessions) is cached in memory where appropriate.
*   **Lazy Loading:** Images and heavy assets are loaded only when they enter the viewport.
*   **Algorithmic Efficiency:** Search and sort algorithms are optimized to handle array manipulations efficiently, typically operating in O(n log n) time complexity.

## Limitations

*   **Persistence Scalability:** As the system relies on JSON files, it is not suitable for millions of records. This is a deliberate architectural constraint for the project scope.
*   **Transaction Atomicity:** Without a DBMS, strict ACID compliance is emulated but not guaranteed at the engine level.
