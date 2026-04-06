FinLedger
A financial analytics dashboard with role-based access, interactive charts, and a notification system.

React + Vite
Node.js + Express
MongoDB
JWT Auth
FinLedger is a full-stack dashboard I built to track personal or corporate finances — income vs. expenses over time, category breakdowns, recent transaction feeds, and a leaderboard. The UI leans on glassmorphism-style surfaces and uses tabular-nums throughout so financial figures don't jump around as they update.

Features
Dashboard
Summary cards with baseline-aligned numbers
Monthly income vs. expense bar/line chart
Spending breakdown by category (doughnut chart)
Notification dropdown with the 10 most recent transactions
Role-based access
Three roles with different views:

Role	What they can see
admin	System audit logs, user management, high-equity investor tracking
analyst	Global trends, leaderboard, investor portfolios
user	Personal journal, payment history, leaderboard rank
Other
System status page for infrastructure health — useful for debugging deploys
Error boundaries to prevent one broken widget from taking down the whole dashboard
Stack
Frontend: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion
Backend: Node.js, Express.js
Database: MongoDB via Mongoose
Auth: JWT
Getting started
You'll need Node.js and a MongoDB instance (local or Atlas) before starting.

git clone https://github.com/ayushgilhotra/FinLedger.git
cd FinLedger
1. Environment variables
Copy the example file and fill in your values:

cp server/.env.example server/.env
You'll need MONGO_URI and JWT_SECRET at minimum.

2. Backend
cd server
npm install
node src/server.js
3. Frontend
cd ../client
npm install
npm run dev
Deployment
Backend (Render / Railway)
Root directory: server/
Start command: node src/server.js
Env vars: MONGO_URI, JWT_SECRET
Frontend (Vercel / Netlify)
Root directory: client/
Build command: npm run build
Publish directory: dist/
Env var: VITE_API_URL pointing to your deployed backend URL

 Detailed Documentation :- https://drive.google.com/file/d/1ebMQCrZh9Kb3kg2tp5Lt6hUDxWVtVZRF/view?usp=drive_link
