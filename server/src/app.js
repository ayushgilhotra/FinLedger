const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./utils/errors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const transactionRoutes = require('./routes/transactions.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
