const express = require('express');
const router = express.Router();

const BPRoutes = require('./businesspartnerRoutes');
const OrderRoutes = require('./orderRoutes');
const ItemRoutes = require('./itemRoutes');
const PurchaseOrderRoutes = require('./purchaseOrderRoutes');

router.use('/business-partners', BPRoutes);
router.use('/orders', OrderRoutes);
router.use('/purchase-orders', PurchaseOrderRoutes);
router.use('/items', ItemRoutes);

module.exports = router;