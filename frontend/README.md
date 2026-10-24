# Money Tracker - React Frontend

Modern, fast, and responsive Personal Finance & Money Tracking web application built with **React 18**, **Vite**, **Tailwind CSS**, **Recharts**, and **Lucide Icons** — ready for zero-config deployment on **Vercel**.

---

## 🌟 Key Features
- **Modern Dashboard**:
  - Live Total Net Balance, Monthly Income, Monthly Expense, and Savings Rate.
  - Interactive 6-month cash flow trend bar chart (Recharts).
  - Monthly spending by category breakdown doughnut chart.
  - Recent transactions list with quick delete action.
- **Transaction Management**:
  - Full-text search and filtering by Category, Type (Income vs. Expense), and Date ranges.
  - Add & Edit transaction modals with category selection, date picker, payment methods (Credit Card, Debit Card, Bank Transfer, UPI, Cash), and notes.
  - Export full statement to CSV directly in one click.
- **Budget Tracking**:
  - Set category spending limits per month/year.
  - Real-time progress bars with dynamic status indicators (Green < 70%, Yellow 70-99%, Red > 100% Exceeded).
  - Total monthly budgeted vs. spent overview.
- **Financial Analytics**:
  - Detailed cash flow statements, historical net savings trends, and category distribution percentages.
- **Multi-Currency Support**:
  - Switch display currency between USD ($), EUR (€), GBP (£), INR (₹), CAD, AUD, JPY (¥), and more.
- **1-Click Demo Login**:
  - One-click access with `demo@moneytracker.com` to explore pre-populated realistic data instantly!

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```env
# Point to your local Spring Boot backend or Render backend
VITE_API_BASE_URL=http://localhost:8080/api
```
*(If left unset in development, Vite automatically proxies `/api` to `http://localhost:8080`)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🌐 Deploying to Vercel

### Step 1: Push Code to GitHub / GitLab
Make sure both `frontend` and `backend` directories are pushed to your repository.

### Step 2: Import Project on Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Select your repository from GitHub.

### Step 3: Configure Project Settings on Vercel
1. **Framework Preset**: `Vite` (Vercel usually detects this automatically).
2. **Root Directory**: Click *Edit* and select `frontend`.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   Add the following environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<YOUR-RENDER-BACKEND-SERVICE>.onrender.com/api`
   *(Replace with the actual URL provided by Render for your Spring Boot backend)*

### Step 4: Click Deploy
Vercel will build the React application and deploy it globally on their high-speed edge network with automated SSL and SPA route rewriting (handled via `vercel.json`).

