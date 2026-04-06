# FinLedger | Finance Dashboard Monorepo

A high-end, data-dense fintech dashboard system built with React 18, Express, and SQLite.

## Project Structure

- `server/`: Express.js backend with SQLite (better-sqlite3) and JWT auth.
- `client/`: Vite-powered React frontend with Tailwind CSS and Recharts.

## Setup & Running

1.  **Install all dependencies**:
    ```bash
    npm run install:all
    ```
2.  **Run Development Environment**:
    Starts both the backend (port 3000) and the frontend (port 5173).
    ```bash
    npm run dev
    ```

## Default Credentials

- **Admin Account**: `admin@finance.com` / `admin123`
- **Analyst Account**: Register a new user and change role in the User Management tab (Admin only).

## Role Capabilities

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ✅ | ✅ | ✅ (Own Only) |
| Create Transaction | ✅ | ✅ | ❌ |
| Edit Transaction | ✅ (All) | ✅ (Own Only) | ❌ |
| Delete Transaction | ✅ (All) | ✅ (Own Only) | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

## Global Design System

- **Primary Colors**: Cyan-Teal accents on a deep Blue-Noir background.
- **Typography**: Geometric Syne for display, professional IBM Plex Sans for body.
- **Charts**: Interactive Recharts with dark-theme integration.
- **Auth**: Secure JWT persistence with localStorage and Axios interceptors.

## How to Change API URL

Update `VITE_API_URL` in the root `.env` file.
