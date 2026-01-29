const express = require('express');
const router = express.Router();
const AuthController = require('../../../controllers/AuthController');
const { loginSchema, validate, forgotPassword, resetPasswordSchema, changePasswordValidator } = require('../../../validators/authValidation');
const authMiddleware = require('../../../middlewares/authMiddleware');


router.post('/login', validate(loginSchema), AuthController.login);
router.post('/sap-login', authMiddleware, AuthController.sapLogin);
router.post('/forgot-password', validate(forgotPassword), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/change-password', validate(changePasswordValidator), authMiddleware, AuthController.changePassword);

router.get('/profile', authMiddleware, AuthController.profile);
router.post('/logout', AuthController.logout);

module.exports = router;