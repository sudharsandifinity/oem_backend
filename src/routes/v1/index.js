const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

const adminRoutes = require('./admin/index');
const userRoutes = require('./user/index');
const authRoutes = require('./auth/index');
const baseRoutes = require('./baseRoutes');
const sapRoutes = require('./sap/index');
const essRoutes = require('./ess/index');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermisson = require('../../middlewares/checkPermissonMiddleware');

router.use('/auth', authRoutes);
router.use('/base', baseRoutes);
router.use('/admin', authMiddleware, checkPermisson, adminRoutes);
router.use('/user', userRoutes);
router.use('/sap', authMiddleware, sapRoutes);
router.use('/ess', authMiddleware, essRoutes);
router.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'UP', db: 'OK', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ status: 'DOWN', db: 'FAIL', error: error.message });
    }
});

module.exports = router;