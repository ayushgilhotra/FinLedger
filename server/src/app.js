const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./utils/errors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const transactionRoutes = require('./routes/transactions.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Static assets for Production
// In production, the client/dist contents will be in the 'public' folder
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// SPA Fallback for React Router
// Using middleware instead of a route to bypass path-to-regexp v8 string constraints
app.use((req, res, next) => {
  // If request begins with /api or has an extension (static files), don't catch it
  if (req.url.startsWith('/api/') || req.url.includes('.')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
