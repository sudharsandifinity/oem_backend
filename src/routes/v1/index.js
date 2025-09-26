const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

const adminRoutes = require('./admin/index');
const authRoutes = require('./auth/index');
const sapRoutes = require('./sapRoutes');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermisson = require('../../middlewares/checkPermissonMiddleware');

router.use('/admin', authMiddleware, checkPermisson, adminRoutes);
router.use('/auth', authRoutes);
router.use('/sap', sapRoutes);
router.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'UP', db: 'OK', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ status: 'DOWN', db: 'FAIL', error: error.message });
    }
});

module.exports = router;