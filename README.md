<div align="center">
  <img src="client/src/assets/img/chocolate.png" alt="Confectionery ERP Logo" width="150"/>
  

  <h1 style="font-family: 'Segoe UI', sans-serif; letter-spacing: 2px; text-transform: uppercase;">Confectionery ERP Platform</h1>
  <h3 style="color: #666;">Distributed Supply Chain & Retail Management System</h3>

  <p>
    <img src="https://img.shields.io/badge/Runtime-Node.js_16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/Frontend-Vue.js_3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js"/>
    <img src="https://img.shields.io/badge/Architecture-RESTful_API-0052CC?style=for-the-badge&logo=ark-ecosystem&logoColor=white" alt="REST"/>
    <img src="https://img.shields.io/badge/Data-NoSQL_File_System-orange?style=for-the-badge" alt="JSON DB"/>
  </p>

  <p align="center" style="max-width: 800px; margin: auto;">
    <strong>A centralized, multi-tenant digital ecosystem engineered to orchestrate the lifecycle of chocolate production, facility management, inventory logistics, and consumer engagement.</strong>
  </p>

  <p>
    <a href="WP_E2_Projekat.pdf"><strong>📄 View Domain Specification (PDF) »</strong></a>
    <br>
    <a href="#architecture-and-design"><strong>🏛 Architecture »</strong></a>
    ·
    <a href="#key-features"><strong>✨ Key Features »</strong></a>
  </p>
</div>

<br>

---

## 1. Project Overview

**Confectionery ERP** is a sophisticated web-based platform designed to digitize the operations of a distributed manufacturing network. Unlike standard e-commerce solutions, this system introduces a complex hierarchical management structure (RBAC) that models real-world business constraints.

The system solves the problem of decentralized inventory and sales management by providing a unified interface where:
1.  **Administrators** oversee the entire network of factories and personnel.
2.  **Managers** operate individual facilities, curating product lines and managing workforce logistics.
3.  **Workers** maintain real-time inventory levels.
4.  **Customers** engage in a gamified purchasing experience with loyalty rewards.

This solution is engineered to operate without a traditional RDBMS, utilizing a **custom high-performance JSON persistence layer** to ensure data portability and integrity in constrained environments.

---

## 2. Key Engineering Features

### Multi-Tiered Role-Based Access Control (RBAC)
The system implements a rigid hierarchy with distinct capability scopes:
*   **Administrator:** Global system control, factory instantiation, manager appointment, and "suspicious user" auditing (Fraud Detection).
*   **Manager:** Facility-level administration, worker recruitment, inventory cataloging, and comment moderation.
*   **Worker:** Operational execution, specifically regarding atomic stock level adjustments.
*   **Customer:** End-user interaction, transactional purchasing, and loyalty tier progression.

### Factory & Inventory Lifecycle
*   **Factory Instantiation:** Administrators commission new facilities, assigning unique metadata and managerial staff.
*   **Geospatial Intelligence:** Integration with **OpenLayers** provides interactive map visualizations for factory locations, allowing location-based filtering.
*   **Inventory Control:** Real-time stock validation ensures concurrency safety during high-traffic purchasing events.

### Algorithmic Loyalty System
The system features a proprietary algorithm for customer retention and gamification:
*   **Point Accumulation:** `Points = (Order Price / 1000) * 133`
*   **Dynamic Tiers:** Users automatically graduate between **Bronze**, **Silver**, and **Gold** tiers based on point thresholds, unlocking progressive discount algorithms.
*   **Churn Prevention:** Cancellation logic triggers penalty algorithms (`Lost Points = Price * 4`), discouraging frivolous ordering.

### Security & Fraud Detection
*   **Suspicious Activity Detection:** The system implements a sliding window algorithm to flag users who cancel >5 orders within 30 days.
*   **Content Moderation:** A "Human-in-the-loop" pattern ensures customer reviews remain hidden until explicitly approved by the facility manager.

---

## 3. Architecture and Design

The application follows a strictly decoupled **Client-Server Architecture**, adhering to **RESTful** principles.

### High-Level Components
1.  **Presentation Layer (Frontend):**
    Built with **Vue.js**, providing a reactive Single Page Application (SPA) experience. It utilizes **Axios** for asynchronous communication and component-based design for modularity.

2.  **Application Layer (Backend):**
    Powered by **Node.js & Express**, handling routing, JWT authentication, business logic execution, and data serialization.

3.  **Persistence Layer (JSON Engine):**
    In compliance with specific architectural constraints, the system utilizes a custom file-based storage engine. A **Repository Design Pattern** abstracts file I/O operations, ensuring that the business logic remains agnostic to the storage medium (allowing for easy future migration to MongoDB/Postgres).

### Data Flow
`User Action` $\rightarrow$ `Vue Component` $\rightarrow$ `REST API` $\rightarrow$ `Controller` $\rightarrow$ `Service (Logic)` $\rightarrow$ `Repository (DAO)` $\rightarrow$ `JSON Storage`

---

## 4. Technology Stack

*   **Runtime:** Node.js (Non-blocking I/O for concurrency)
*   **Framework:** Express.js (Middleware & Routing)
*   **Frontend:** Vue.js 3 (Composition API)
*   **Mapping:** OpenLayers (Geospatial Rendering)
*   **Security:** JWT (Stateless Authentication)

---

## 5. Installation and Setup

### Prerequisites
*   Node.js (v14+) & npm

### Deployment Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/bteodora/confectionery-erp-nodejs.git
    ```

2.  **Backend Initialization**
    ```bash
    cd server
    npm install
    npm start
    # Server listens on port 3000
    ```

3.  **Frontend Initialization**
    ```bash
    cd client
    npm install
    npm run serve
    # Application live at http://localhost:8080
    ```

---

## 6. Project Structure

The directory structure promotes separation of concerns (SoC).

```text
/
├── client/                 # Vue.js SPA
│   ├── src/
│   │   ├── components/     # Atomic UI Elements
│   │   ├── views/          # Page layouts
│   │   ├── services/       # API Connectors (Axios)
│   │   └── router/         # Navigation Guards
├── server/                 # Express API
│   ├── data/               # JSON Database (The "Storage")
│   ├── src/
│   │   ├── controllers/    # Endpoint Logic
│   │   ├── services/       # Business Rules
│   │   ├── repositories/   # Data Access Layer
│   │   └── models/         # DTOs
└── README.md
