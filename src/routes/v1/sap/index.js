const express = require('express');
const router = express.Router();

const BPRoutes = require('./businesspartnerRoutes');
const OrderRoutes = require('./orderRoutes');
const SalesQuotationRoutes = require('./salesQuotationRoutes');
const PurchaseQuotationRoutes = require('./purchaseQuotationRoutes');
const ItemRoutes = require('./itemRoutes');
const ServiceRoutes = require('./serviceRoutes');
const PurchaseOrderRoutes = require('./purchaseOrderRoutes');
const TaxCodeRoutes = require('./taxCodeRoutes');
const AttachmentRoutes = require('./attachmentRoutes');
const OtherRoutes = require('./otherRoutes');

router.use('/business-partners', BPRoutes);
router.use('/orders', OrderRoutes);
router.use('/quotations', SalesQuotationRoutes);
router.use('/purchase-orders', PurchaseOrderRoutes);
router.use('/purchase-quotations', PurchaseQuotationRoutes);
router.use('/items', ItemRoutes);
router.use('/services', ServiceRoutes);
router.use('/tax-code', TaxCodeRoutes);
router.use('/attachments', AttachmentRoutes);
router.use('/others', OtherRoutes);

module.exports = router;