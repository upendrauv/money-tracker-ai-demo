# Money Tracker - Spring Boot Backend

Production-ready RESTful API for Money Tracker, built with **Spring Boot 3**, **Spring Security (JWT)**, **Spring Data JPA**, and **MySQL** (optimized for **Aiven Cloud MySQL** and **Render** deployment).

---

## 🌟 Features
- **JWT Authentication & Authorization**: Secure stateless token authentication with BCrypt password hashing.
- **Preloaded Seed Data**: Automatically configures standard income/expense categories and an optional instant-access demo account (`demo@moneytracker.com` / `password123`).
- **Transaction Management**: Add, update, view, delete, filter by category/type/date, and full-text keyword search.
- **Budget Tracking**: Set monthly budgets per category and monitor real-time spent vs. remaining progress.
- **Financial Analytics & Dashboard**: Total balance, monthly cash flow, savings rate %, 6-month historical trends, and category spending breakdown.
- **Production Health Checks**: Zero-downtime health endpoint `/api/health` verifying active DB connectivity for Render.
- **Optimized HikariCP**: Configured connection pooling with keep-alive to prevent cloud database timeouts on Aiven.

---

## 🚀 Connecting to Aiven MySQL

1. Log into your [Aiven Console](https://console.aiven.io/).
2. Select your **MySQL Service** (or create a free trial MySQL service).
3. In the **Overview** tab, find your **Connection Information**:
   - **Host** (e.g., `mysql-12345-yourorg.aivencloud.com`)
   - **Port** (e.g., `21432`)
   - **User** (e.g., `avnadmin`)
   - **Password** (click *Show* to reveal)
   - **Database Name** (default is `defaultdb`)
4. Construct your JDBC URL:
   ```text
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED
   ```

---

## 💻 Running Locally

### 1. Configure Environment Variables
Copy `.env.example` to `.env` or set environment variables in your terminal / IDE:
```bash
# Windows PowerShell
$env:DB_URL="jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED"
$env:DB_USERNAME="avnadmin"
$env:DB_PASSWORD="<YOUR_AIVEN_PASSWORD>"
$env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
$env:PORT="8080"
```

### 2. Build and Run
```bash
mvn clean spring-boot:run
```
Or on Windows with Maven in PATH:
```cmd
mvn clean package -DskipTests
java -jar target/money-tracker-backend-1.0.0.jar
```

The server will start on `http://localhost:8080`.

---

## 🌐 Deploying to Render

### Method 1: Using Render Blueprint (`render.yaml`)
1. Push your repository to GitHub or GitLab.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Select your repository. Render will automatically detect `backend/render.yaml`.
4. Fill in the prompted secrets: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
5. Click **Apply**.

### Method 2: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render will automatically detect `Dockerfile`)
   - **Instance Type**: `Free`
4. In the **Environment Variables** tab, add:
   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `DB_URL` | `jdbc:mysql://<AIVEN_HOST>:<PORT>/defaultdb?sslMode=REQUIRED` |
   | `DB_USERNAME` | `avnadmin` |
   | `DB_PASSWORD` | `<AIVEN_PASSWORD>` |
   | `JWT_SECRET` | `Random 64-char string or base64 key` |
   | `ALLOWED_ORIGINS` | `http://localhost:5173,https://<YOUR-FRONTEND>.vercel.app` |
5. Set **Health Check Path** to: `/api/health`
6. Click **Create Web Service**.

Once deployed, your backend will be live at:
`https://<service-name>.onrender.com`

---

## 📡 API Reference

### Health
- `GET /api/health` - Health check & database connection probe

### Authentication
- `POST /api/auth/register` - Create new user `{ fullName, email, password, currency }`
- `POST /api/auth/login` - Authenticate `{ email, password }` -> returns `{ token, user }`
- `GET /api/auth/me` - Get profile of authenticated user
- `PUT /api/auth/currency` - Update user currency symbol/code

### Dashboard & Analytics
- `GET /api/dashboard` - Get full summary (total balance, monthly income, expense, savings %, 6-month trends, category breakdown, recent 5 transactions)

### Transactions
- `GET /api/transactions` - Filtered & paginated transactions (`?type=EXPENSE&categoryId=2&startDate=2026-10-01&endDate=2026-10-31&search=market&page=0&size=20`)
- `GET /api/transactions/{id}` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Budgets
- `GET /api/budgets?month=10&year=2026` - Get category budgets & spent progress
- `POST /api/budgets` - Create or update monthly category budget
- `DELETE /api/budgets/{id}` - Delete budget

### Categories
- `GET /api/categories` - Get all available categories (default + custom)
- `POST /api/categories` - Create custom user category

