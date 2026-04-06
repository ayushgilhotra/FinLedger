const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'analyst', 'user', 'viewer'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  department: { type: String, default: '' },
}, { timestamps: true });

// Virtual: created_at alias for backward compat
userSchema.virtual('created_at').get(function() {
  return this.createdAt;
});

userSchema.set('toJSON', { 
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
