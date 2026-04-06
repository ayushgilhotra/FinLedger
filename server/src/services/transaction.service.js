const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const { AppError } = require('../utils/errors');

const createTransaction = async (userId, data) => {
  const { amount, type, category, date, notes } = data;
  const transaction = await Transaction.create({
    userId,
    amount,
    type,
    category,
    date: new Date(date),
    notes: notes || '',
  });

  return {
    id: transaction._id,
    user_id: transaction.userId,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    notes: transaction.notes,
  };
};

const listTransactions = async (user, filters) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = filters;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { isDeleted: false };

  // Role-based scoping
  if (user.role === 'user' || user.role === 'viewer') {
    query.userId = new mongoose.Types.ObjectId(user.id);
  }

  if (type) query.type = type;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const [total, data] = await Promise.all([
    Transaction.countDocuments(query),
    Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
  ]);

  // Normalize for frontend
  const normalizedData = data.map(t => ({
    ...t,
    id: t._id,
    user_id: t.userId,
    is_deleted: t.isDeleted ? 1 : 0,
    created_at: t.createdAt,
  }));

  return {
    data: normalizedData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getTransaction = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Transaction not found', 404, 'NOT_FOUND');
  }

  const record = await Transaction.findOne({ _id: id, isDeleted: false }).lean();
  if (!record) throw new AppError('Transaction not found', 404, 'NOT_FOUND');

  if ((user.role === 'user' || user.role === 'viewer') && 
      record.userId.toString() !== user.id.toString()) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  return {
    ...record,
    id: record._id,
    user_id: record.userId,
    is_deleted: record.isDeleted ? 1 : 0,
    created_at: record.createdAt,
  };
};

const updateTransaction = async (id, user, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Transaction not found', 404, 'NOT_FOUND');
  }

  const record = await Transaction.findOne({ _id: id, isDeleted: false });
  if (!record) throw new AppError('Transaction not found', 404, 'NOT_FOUND');

  if (user.role === 'analyst' && record.userId.toString() !== user.id.toString()) {
    throw new AppError('You can only modify your own records', 403, 'FORBIDDEN');
  }
  if (user.role === 'viewer') {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  // Map snake_case keys to camelCase if needed
  const updateData = {};
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.notes !== undefined) updateData.notes = data.notes;

  Object.assign(record, updateData);
  await record.save();

  return {
    ...record.toObject(),
    id: record._id,
    user_id: record.userId,
  };
};

const deleteTransaction = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Transaction not found', 404, 'NOT_FOUND');
  }

  const record = await Transaction.findOne({ _id: id, isDeleted: false });
  if (!record) throw new AppError('Transaction not found', 404, 'NOT_FOUND');

  if (user.role === 'analyst' && record.userId.toString() !== user.id.toString()) {
    throw new AppError('You can only modify your own records', 403, 'FORBIDDEN');
  }
  if (user.role === 'viewer') {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  record.isDeleted = true;
  await record.save();
  return { success: true };
};

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
