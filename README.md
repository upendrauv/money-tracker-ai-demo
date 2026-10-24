# 💰 Money Tracker - Full Stack Web Application

A full-stack, production-ready Personal Finance & Money Tracking platform built with a **React + Tailwind CSS** frontend and a **Spring Boot 3 + MySQL** backend. 

Engineered specifically for cloud deployment with **MySQL on Aiven Cloud**, **Backend on Render**, and **Frontend on Vercel**.

---

## 📁 Repository Structure

```
money-tracker/
├── backend/                       # Spring Boot 3 Java Backend
│   ├── src/
│   │   ├── main/java/com/moneytracker/
│   │   │   ├── config/            # JWT, Security, CORS, DataInitializer
│   │   │   ├── controller/        # REST Endpoints (Auth, Tx, Budget, Dash)
│   │   │   ├── dto/               # Request/Response Data Transfer Objects
│   │   │   ├── entity/            # JPA Entities (User, Category, Tx, Budget)
│   │   │   ├── exception/         # Global Exception Handlers
│   │   │   ├── repository/        # Spring Data JPA Repositories
│   │   │   └── service/           # Business Logic Services
│   │   └── main/resources/
│   │       └── application.properties # HikariCP & Aiven DB Config
│   ├── Dockerfile                 # Multi-stage Docker container for Render
│   ├── render.yaml                # Render Blueprint Deployment Spec
│   ├── .env.example               # Environment Variables Template
│   ├── pom.xml                    # Maven Build Specification
│   └── README.md                  # Backend & Render Documentation
│
├── frontend/                      # React 18 + Vite Frontend
│   ├── src/
│   │   ├── api/                   # Axios client & API endpoints
│   │   ├── components/            # Reusable UI & Modals & Recharts
│   │   ├── context/               # AuthContext (JWT & User state)
│   │   ├── pages/                 # Dashboard, Transactions, Budgets, etc.
│   │   └── utils/                 # Currency formatters & CSV export
│   ├── vercel.json                # Single-Page App rewrites for Vercel
│   ├── vite.config.js             # Vite configuration & dev proxy
│   ├── tailwind.config.js         # Tailwind CSS theme styling
│   ├── package.json               # NPM Dependencies & Scripts
│   └── README.md                  # Frontend & Vercel Documentation
│
└── README.md                      # Complete End-to-End Guide
```

---

## ⚡ Architecture & Deployment Overview

```
 [User Browser]
       │
       ▼
 [Vercel Edge Network]  ─── HTTPS ───▶  [Render Web Service]  ─── TLS/SSL ───▶  [Aiven Cloud]
 React Single Page App                  Spring Boot 3 REST API                 Managed MySQL 8.x
 (money-tracker.vercel.app)             (backend.onrender.com)                 (mysql-xyz.aivencloud.com)
```

---

## 🛠️ Step 1: Database Setup on Aiven MySQL

1. Sign up / Log into [Aiven.io](https://console.aiven.io/).
2. Click **Create Service** -> Choose **MySQL** (Free trial or hobby tier).
3. Select your cloud provider and closest region.
4. Once the service is running, find the **Connection Details** on the Overview tab:
   - **Host**: `mysql-XXXX.aivencloud.com`
   - **Port**: `XXXXX`
   - **User**: `avnadmin`
   - **Password**: `Show password`
   - **Database Name**: `defaultdb`
   - **SSL Mode**: `REQUIRED`
5. Note down your JDBC URL:
   ```text
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED
   ```

---

## 🚀 Step 2: Deploy Backend to Render

1. Push your repository to **GitHub** or **GitLab**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Name**: `money-tracker-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render automatically uses `backend/Dockerfile`)
   - **Instance Type**: `Free`
5. Click **Advanced** and add the following **Environment Variables**:
   | Variable | Value | Description |
   |---|---|---|
   | `PORT` | `8080` | Container port |
   | `DB_URL` | `jdbc:mysql://<AIVEN_HOST>:<PORT>/defaultdb?sslMode=REQUIRED` | Aiven JDBC URL |
   | `DB_USERNAME` | `avnadmin` | Aiven database user |
   | `DB_PASSWORD` | `<YOUR_AIVEN_PASSWORD>` | Aiven database password |
   | `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit secret key |
   | `ALLOWED_ORIGINS` | `http://localhost:5173,https://*.vercel.app` | Allowed CORS origins |
6. Set **Health Check Path** to `/api/health`.
7. Click **Create Web Service**.
8. Once built and healthy, copy your Render URL:  
   `https://money-tracker-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel

1. Log into [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
2. Connect your Git repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<YOUR-RENDER-BACKEND-NAME>.onrender.com/api`
5. Click **Deploy**.
6. Vercel will build and deploy your app. Your frontend is now live!

---

## 💻 Running the Entire App Locally

### 1. Run the Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 2. Run the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔑 Instant Demo Account

When the backend starts for the first time, it automatically creates default categories and seeds a demo account so you can test immediately:

- **Email**: `demo@moneytracker.com`
- **Password**: `password123`
*(Or click the 1-Click "Demo Login" button on the sign-in page!)*

