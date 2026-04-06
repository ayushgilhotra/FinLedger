const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Get summary totals: total income, expenses, balance, transaction count
 * Admin/Analyst → all transactions; User → own transactions only
 */
const getSummary = async (user) => {
  const matchStage = { isDeleted: false };
  if (user.role === 'user' || user.role === 'viewer') {
    matchStage.userId = new mongoose.Types.ObjectId(user.id);
  }

  const result = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
        },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  const data = result[0] || { totalIncome: 0, totalExpenses: 0, transactionCount: 0 };

  return {
    totalIncome: data.totalIncome || 0,
    totalExpenses: data.totalExpenses || 0,
    netBalance: (data.totalIncome || 0) - (data.totalExpenses || 0),
    transactionCount: data.transactionCount || 0,
  };
};

/**
 * Breakdown by category: category name, total amount, count
 */
const getCategories = async (user) => {
  const matchStage = { isDeleted: false };
  if (user.role === 'user' || user.role === 'viewer') {
    matchStage.userId = new mongoose.Types.ObjectId(user.id);
  }

  return Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        total: 1,
        count: 1
      }
    }
  ]);
};

/**
 * Monthly income vs expense for last 6 months (oldest → newest for chart)
 */
const getTrends = async (user) => {
  const matchStage = { isDeleted: false };
  if (user.role === 'user' || user.role === 'viewer') {
    matchStage.userId = new mongoose.Types.ObjectId(user.id);
  }

  // Filter to last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  matchStage.date = { $gte: sixMonthsAgo };

  const results = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        income: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
        },
        expenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' }
              ]
            }
          ]
        },
        income: 1,
        expenses: 1
      }
    }
  ]);

  return results;
};

/**
 * Recent 10 transactions — most recent first
 */
const getRecent = async (user) => {
  const query = { isDeleted: false };
  if (user.role === 'user' || user.role === 'viewer') {
    query.userId = new mongoose.Types.ObjectId(user.id);
  }

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(10)
    .lean();

  // Normalize for frontend compatibility
  return transactions.map(t => ({
    ...t,
    id: t._id,
    user_id: t.userId,
    is_deleted: t.isDeleted ? 1 : 0,
    created_at: t.createdAt,
  }));
};

/**
 * Get leaderboard: Top users by net balance
 */
const getLeaderboard = async () => {
  return Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$userId',
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
        }
      }
    },
    {
      $addFields: {
        netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] }
      }
    },
    { $sort: { netBalance: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        avatar: '$user.avatar',
        netBalance: 1,
        totalIncome: 1,
        totalExpenses: 1
      }
    }
  ]);
};

/**
 * Get top investors: Users with highest investment category spending
 */
const getTopInvestors = async () => {
  return Transaction.aggregate([
    { $match: { isDeleted: false, category: 'Investment' } },
    {
      $group: {
        _id: '$userId',
        totalInvested: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalInvested: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        avatar: '$user.avatar',
        email: '$user.email',
        role: '$user.role',
        totalInvested: 1,
        count: 1
      }
    }
  ]);
};

/**
 * Get health status: Global system summary for diagnostic mode
 */
const getHealthStatus = async () => {
  const result = await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
        },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  const data = result[0] || { totalIncome: 0, totalExpenses: 0, transactionCount: 0 };
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    metrics: {
      totalIncome: data.totalIncome,
      totalExpenses: data.totalExpenses,
      netBalance: data.totalIncome - data.totalExpenses,
      transactionCount: data.transactionCount
    }
  };
};

/**
 * Recalibrate System: Wipes existing data and seeds with professional demo dataset
 * Replicates src/scripts/seed.js logic for production deployment initialization
 */
const recalibrateSystem = async () => {
  // 1. Clear existing data
  await User.deleteMany({});
  await Transaction.deleteMany({});

  // 2. Definitive User Data (from seed.js)
  const usersData = [
    { name: 'Aryan Sharma', email: 'admin@finance.com', password: 'admin123', role: 'admin', phone: '+91 98765 43210', department: 'Operations', avatar: 'AS' },
    { name: 'Priya Menon', email: 'analyst@finance.com', password: 'analyst123', role: 'analyst', phone: '+91 91234 56789', department: 'Finance', avatar: 'PM' },
    { name: 'Rahul Verma', email: 'rahul.analyst@finance.com', password: 'analyst123', role: 'analyst', phone: '+91 93456 78901', department: 'Risk & Compliance', avatar: 'RV' },
    { name: 'Sneha Kapoor', email: 'user@finance.com', password: 'user123', role: 'user', phone: '+91 87654 32109', department: 'Marketing', avatar: 'SK' },
    { name: 'Vikram Nair', email: 'vikram.nair@finance.com', password: 'user123', role: 'user', phone: '+91 99887 76655', department: 'Engineering', avatar: 'VN' },
    { name: 'Ananya Pillai', email: 'ananya.pillai@finance.com', password: 'user123', role: 'user', phone: '+91 88776 65544', department: 'HR', avatar: 'AP' },
    { name: 'Karthik Rajan', email: 'karthik.rajan@finance.com', password: 'user123', role: 'user', phone: '+91 77665 54433', department: 'Sales', avatar: 'KR' },
    { name: 'Divya Krishnamurthy', email: 'divya.k@finance.com', password: 'user123', role: 'user', phone: '+91 66554 43322', department: 'Legal', avatar: 'DK' },
    { name: 'Amit Joshi', email: 'amit.joshi@finance.com', password: 'user123', role: 'user', phone: '+91 55443 32211', department: 'Operations', avatar: 'AJ' },
    { name: 'Meera Iyer', email: 'meera.iyer@finance.com', password: 'user123', role: 'user', status: 'inactive', phone: '+91 44332 21100', department: 'Finance', avatar: 'MI' },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const { password, ...rest } = userData;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ ...rest, passwordHash });
    createdUsers.push(user);
  }

  // 3. Generate Transactions (Last 6 Months)
  const incomeCategories = [
    { category: 'Salary', range: [80000, 150000], notes: ['Monthly salary credit', 'Base salary + bonus'] },
    { category: 'Freelance', range: [15000, 60000], notes: ['Project payment', 'Consulting fees'] },
    { category: 'Investment', range: [5000, 30000], notes: ['Dividend received', 'Mutual fund returns'] },
  ];

  const expenseCategories = [
    { category: 'Rent', range: [15000, 35000], notes: ['Monthly rent'] },
    { category: 'Food', range: [2000, 8000], notes: ['Grocery shopping', 'Restaurant dining'] },
    { category: 'Travel', range: [3000, 20000], notes: ['Cab expenses', 'Flight booking'] },
    { category: 'Healthcare', range: [2000, 15000], notes: ['Medicine purchase', 'Doctor fees'] },
    { category: 'Utilities', range: [1500, 5000], notes: ['Electricity bill', 'Internet bill'] },
    { category: 'Shopping', range: [3000, 25000], notes: ['Clothing', 'Electronics'] },
  ];

  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getDateInPast = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  let totalTransactions = 0;
  for (const user of createdUsers) {
    const txns = [];
    for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
      const baseDay = monthsAgo * 30;
      // Income
      const incomeCount = randomBetween(1, 2);
      for (let i = 0; i < incomeCount; i++) {
        const cat = randomItem(incomeCategories);
        txns.push({
          userId: user._id,
          amount: randomBetween(cat.range[0], cat.range[1]),
          type: 'income',
          category: cat.category,
          date: getDateInPast(baseDay + randomBetween(0, 28)),
          notes: randomItem(cat.notes),
          isDeleted: false,
        });
      }
      // Expenses
      const expenseCount = randomBetween(5, 8);
      for (let i = 0; i < expenseCount; i++) {
        const cat = randomItem(expenseCategories);
        txns.push({
          userId: user._id,
          amount: randomBetween(cat.range[0], cat.range[1]),
          type: 'expense',
          category: cat.category,
          date: getDateInPast(baseDay + randomBetween(0, 28)),
          notes: randomItem(cat.notes),
          isDeleted: false,
        });
      }
    }
    await Transaction.insertMany(txns);
    totalTransactions += txns.length;
  }

  return { usersCreated: createdUsers.length, transactionsCreated: totalTransactions };
};

module.exports = { 
  getSummary, 
  getCategories, 
  getTrends, 
  getRecent, 
  getLeaderboard, 
  getTopInvestors, 
  getHealthStatus,
  recalibrateSystem 
};
