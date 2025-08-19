const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

// Load API v1
const adminRoutes = require('./admin/index');
const authRoutes = require('./auth/index');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermisson = require('../../middlewares/checkPermissonMiddleware');

// Mount versioned API under /api/v1
router.use('/admin', authMiddleware, adminRoutes);
router.use('/auth', authRoutes);
router.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'UP', db: 'OK', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ status: 'DOWN', db: 'FAIL', error: error.message });
    }
});

module.exports = router;