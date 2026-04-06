const express = require('express');
const router = express.Router();
const transactionService = require('../services/transaction.service');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/rbac');
const validate = require('../middlewares/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../validators/transaction.schema');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const result = await transactionService.listTransactions(req.user, req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransaction(req.params.id, req.user);
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
});

router.post('/', checkRole('admin', 'analyst'), validate(createTransactionSchema), async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', checkRole('admin', 'analyst'), validate(updateTransactionSchema), async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.user, req.body);
    res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', checkRole('admin', 'analyst'), async (req, res, next) => {
  try {
    const result = await transactionService.deleteTransaction(req.params.id, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
