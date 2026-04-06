const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

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

module.exports = { 
  getSummary, 
  getCategories, 
  getTrends, 
  getRecent, 
  getLeaderboard, 
  getTopInvestors, 
  getHealthStatus 
};
