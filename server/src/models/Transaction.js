const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true, min: 0.01 },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '', trim: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ isDeleted: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: -1 });

transactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.user_id = ret.userId;
    ret.is_deleted = ret.isDeleted ? 1 : 0;
    ret.created_at = ret.createdAt;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
