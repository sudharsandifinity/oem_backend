const express = require('express');
const router = express.Router();

const BPRoutes = require('./businesspartnerRoutes');
const OrderRoutes = require('./orderRoutes');
const ItemRoutes = require('./itemRoutes');

router.use('/business-partners', BPRoutes);
router.use('/orders', OrderRoutes);
router.use('/items', ItemRoutes);

module.exports = router;