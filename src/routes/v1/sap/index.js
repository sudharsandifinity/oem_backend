const express = require('express');
const router = express.Router();

const BPRoutes = require('./businesspartnerRoutes');
const OrderRoutes = require('./orderRoutes');
const ItemRoutes = require('./itemRoutes');
const ServiceRoutes = require('./serviceRoutes');
const PurchaseOrderRoutes = require('./purchaseOrderRoutes');
const TaxCodeRoutes = require('./taxCodeRoutes');
const OtherRoutes = require('./otherRoutes');

router.use('/business-partners', BPRoutes);
router.use('/orders', OrderRoutes);
router.use('/purchase-orders', PurchaseOrderRoutes);
router.use('/items', ItemRoutes);
router.use('/services', ServiceRoutes);
router.use('/tax-code', TaxCodeRoutes);
router.use('/others', OtherRoutes);

module.exports = router;