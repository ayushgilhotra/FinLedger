const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');
const auth = require('../middlewares/auth');

// Public health endpoint for diagnostic mode
router.get('/health', async (req, res, next) => {
  try {
    const data = await dashboardService.getHealthStatus();
    res.json({ success: true, data });
  } catch (err) {
    // Return partial success even if DB is struggling to show the diagnostic page works
    res.status(500).json({ success: false, status: 'unstable', error: err.message });
  }
});

// Production Seeding Trigger
router.post('/recalibrate', async (req, res, next) => {
  try {
    const data = await dashboardService.recalibrateSystem();
    res.json({ success: true, message: 'System successfully recalibrated with professional dataset', data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Recalibration failed', detail: err.message });
  }
});

router.use(auth);

router.get('/summary', async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const data = await dashboardService.getCategories(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/trends', async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/recent', async (req, res, next) => {
  try {
    const data = await dashboardService.getRecent(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const data = await dashboardService.getLeaderboard();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

const checkRole = require('../middlewares/rbac');
router.get('/top-investors', checkRole('admin', 'analyst'), async (req, res, next) => {
  try {
    const data = await dashboardService.getTopInvestors();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
