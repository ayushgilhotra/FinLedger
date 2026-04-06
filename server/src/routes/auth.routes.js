const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/auth.schema');

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const user = await authService.register(req.body.name, req.body.email, req.body.password, req.body.role);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
