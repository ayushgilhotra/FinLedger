# 💎 FinLedger: Modern FinTech Analytics Dashboard

FinLedger is a high-performance, professional financial analytics dashboard designed to provide real-time insights into personal or corporate wealth. Built with a modern tech stack and focusing on baseline-perfect typography, it offers a glassmorphism-inspired UI with robust role-based access control.

![FinLedger Dashboard Overview](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=FinLedger+Modern+Dashboard)

## 🚀 Key Features

### 📊 Professional Analytics
- **Baseline-Perfect Summary Cards**: Numeric values are strictly aligned to a common baseline grid using `tabular-nums` for professional financial presentation.
- **Dynamic Trend Visualization**: Interactive charts showing monthly income vs. expenses.
- **Category Allocation**: Granular breakdown of spending habits using interactive doughnut charts.

### 🔔 Advanced Notification System
- **Stateful Activity Hub**: Professional notification dropdown with backdrop-blur effects.
- **Real-Time Feeds**: Stay updated with the 10 most recent transactions as they happen.

### 🏆 Role-Based Access Control (RBAC)
- **Admin**: Full system audit, user management, and high-equity investor tracking.
- **Analyst**: Access to global trends, leaderboard insights, and investor portfolios.
- **User**: Personal financial journal, payment history, and global leaderboard rank.

### 🛡️ Resilience & Diagnostics
- **System Status Page**: Public diagnostic mode for real-time infrastructure health tracking.
- **Global Error Boundaries**: Robust error handling to ensure application stability under stress.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB (Production ready).
- **Authentication**: JWT (JSON Web Tokens).

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ayushgilhotra/FinLedger.git
cd FinLedger
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory based on `.env.example`.

### 3. Backend Setup
```bash
cd server
npm install
node src/server.js
```

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

## 🌐 Deployment Checklist

### Backend (Render/Railway)
1. Set the root directory to `server/`.
2. Configure `MONGO_URI` and `JWT_SECRET` in environment variables.
3. Use `node src/server.js` as the start command.

### Frontend (Vercel/Netlify)
1. Set the root directory to `client/`.
2. Configure `VITE_API_URL` pointing to your deployed backend.
3. Use `npm run build` as the build command and `dist/` as the publish directory.

---
Managed by **AuthenTick Architecture** 💎
