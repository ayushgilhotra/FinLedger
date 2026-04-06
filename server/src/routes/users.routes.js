const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/rbac');
const { AppError } = require('../utils/errors');
const mongoose = require('mongoose');

router.use(auth);

// GET /api/users — list all users with pagination (Admin/Analyst)
router.get('/', checkRole('admin', 'analyst'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      User.countDocuments({}),
      User.find({})
        .select('-passwordHash -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    // Normalize for frontend
    const data = items.map(u => ({
      ...u,
      id: u._id,
      created_at: u.createdAt,
    }));

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id (Admin/Analyst)
router.get('/:id', checkRole('admin', 'analyst'), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }
    const user = await User.findById(req.params.id).select('-passwordHash -__v').lean();
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json({ success: true, data: { ...user, id: user._id, created_at: user.createdAt } });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/:id/role (Admin only)
router.patch('/:id/role', checkRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'analyst', 'user', 'viewer'].includes(role)) {
      throw new AppError('Invalid role', 400, 'INVALID_INPUT');
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }
    const result = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!result) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/:id/status (Admin only)
router.patch('/:id/status', checkRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      throw new AppError('Invalid status', 400, 'INVALID_INPUT');
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }
    const result = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!result) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
