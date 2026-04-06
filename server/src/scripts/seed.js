/**
 * Seed Script — FinTech Dashboard
 * Creates 10 realistic users + 300+ transactions across 6 months
 * Run: node src/scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fintech';

// ─── USERS ────────────────────────────────────────────────────────────────────
const usersData = [
  // 1 Admin
  {
    name: 'Aryan Sharma',
    email: 'admin@finance.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98765 43210',
    department: 'Operations',
    avatar: 'AS',
  },
  // 2 Analysts
  {
    name: 'Priya Menon',
    email: 'analyst@finance.com',
    password: 'analyst123',
    role: 'analyst',
    phone: '+91 91234 56789',
    department: 'Finance',
    avatar: 'PM',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.analyst@finance.com',
    password: 'analyst123',
    role: 'analyst',
    phone: '+91 93456 78901',
    department: 'Risk & Compliance',
    avatar: 'RV',
  },
  // 7 Regular Users
  {
    name: 'Sneha Kapoor',
    email: 'user@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 87654 32109',
    department: 'Marketing',
    avatar: 'SK',
  },
  {
    name: 'Vikram Nair',
    email: 'vikram.nair@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 99887 76655',
    department: 'Engineering',
    avatar: 'VN',
  },
  {
    name: 'Ananya Pillai',
    email: 'ananya.pillai@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 88776 65544',
    department: 'HR',
    avatar: 'AP',
  },
  {
    name: 'Karthik Rajan',
    email: 'karthik.rajan@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 77665 54433',
    department: 'Sales',
    avatar: 'KR',
  },
  {
    name: 'Divya Krishnamurthy',
    email: 'divya.k@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 66554 43322',
    department: 'Legal',
    avatar: 'DK',
  },
  {
    name: 'Amit Joshi',
    email: 'amit.joshi@finance.com',
    password: 'user123',
    role: 'user',
    phone: '+91 55443 32211',
    department: 'Operations',
    avatar: 'AJ',
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@finance.com',
    password: 'user123',
    role: 'user',
    status: 'inactive',
    phone: '+91 44332 21100',
    department: 'Finance',
    avatar: 'MI',
  },
];

// ─── TRANSACTION TEMPLATES ─────────────────────────────────────────────────────
const incomeCategories = [
  { category: 'Salary', range: [80000, 150000], notes: ['Monthly salary credit', 'Base salary + bonus', 'Salary transferred'] },
  { category: 'Freelance', range: [15000, 60000], notes: ['Web development project', 'Design contract', 'Consulting fees'] },
  { category: 'Investment', range: [5000, 30000], notes: ['Dividend received', 'Mutual fund returns', 'Stock sale proceeds'] },
  { category: 'Business', range: [20000, 80000], notes: ['Client payment', 'Invoice settled', 'Retainer fee'] },
];

const expenseCategories = [
  { category: 'Rent', range: [15000, 35000], notes: ['Monthly rent', 'Office space rent', 'Apartment rent'] },
  { category: 'Food', range: [2000, 8000], notes: ['Grocery shopping', 'Restaurant dining', 'Online food order'] },
  { category: 'Travel', range: [3000, 20000], notes: ['Flight booking', 'Hotel stay', 'Cab expenses', 'Train tickets'] },
  { category: 'Entertainment', range: [1000, 5000], notes: ['OTT subscription', 'Movie tickets', 'Event passes'] },
  { category: 'Healthcare', range: [2000, 15000], notes: ['Doctor consultation', 'Medicine purchase', 'Lab tests', 'Health insurance'] },
  { category: 'Utilities', range: [1500, 5000], notes: ['Electricity bill', 'Internet bill', 'Mobile recharge'] },
  { category: 'Shopping', range: [3000, 25000], notes: ['Clothing purchase', 'Electronics', 'Home furnishing'] },
  { category: 'Education', range: [5000, 20000], notes: ['Course enrollment', 'Book purchase', 'Workshop fee'] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getDateInPast = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

const generateTransactionsForUser = (userId) => {
  const transactions = [];

  // Last 6 months of data
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const baseDay = monthsAgo * 30;

    // 1–2 income transactions per month
    const incomeCount = randomBetween(1, 2);
    for (let i = 0; i < incomeCount; i++) {
      const cat = randomItem(incomeCategories);
      const amount = randomBetween(cat.range[0], cat.range[1]);
      const daysAgo = baseDay + randomBetween(0, 28);
      transactions.push({
        userId,
        amount,
        type: 'income',
        category: cat.category,
        date: getDateInPast(daysAgo),
        notes: randomItem(cat.notes),
        isDeleted: false,
      });
    }

    // 5–8 expense transactions per month
    const expenseCount = randomBetween(5, 8);
    const usedExpenseCategories = new Set();
    for (let i = 0; i < expenseCount; i++) {
      let cat;
      // Try to use unique categories first
      let attempts = 0;
      do {
        cat = randomItem(expenseCategories);
        attempts++;
      } while (usedExpenseCategories.has(cat.category) && attempts < 20);
      usedExpenseCategories.add(cat.category);

      const amount = randomBetween(cat.range[0], cat.range[1]);
      const daysAgo = baseDay + randomBetween(0, 28);
      transactions.push({
        userId,
        amount,
        type: 'expense',
        category: cat.category,
        date: getDateInPast(daysAgo),
        notes: randomItem(cat.notes),
        isDeleted: false,
      });
    }
  }

  return transactions;
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    // Wipe existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of usersData) {
      const { password, ...rest } = userData;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ ...rest, passwordHash });
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name} (${user.role})`);
    }

    // Create transactions for each user
    let totalTransactions = 0;
    for (const user of createdUsers) {
      const txns = generateTransactionsForUser(user._id);
      await Transaction.insertMany(txns);
      totalTransactions += txns.length;
      console.log(`💰 Added ${txns.length} transactions for ${user.name}`);
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   👥 Users created: ${createdUsers.length}`);
    console.log(`   💳 Transactions created: ${totalTransactions}`);
    console.log(`\n📋 Login credentials:`);
    console.log(`   Admin    → admin@finance.com       / admin123`);
    console.log(`   Analyst  → analyst@finance.com     / analyst123`);
    console.log(`   Analyst  → rahul.analyst@finance.com / analyst123`);
    console.log(`   User     → user@finance.com        / user123`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
