const express = require('express');
const router = express.Router();

const FormDataRoutes = require('./formDataRoutes');

router.use('/form-data', FormDataRoutes);

module.exports = router;