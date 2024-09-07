const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public routes
router.post('/login', adminController.loginAdmin);
router.get('/logout', adminController.logoutAdmin);

// Protected routes for admin
router.get('/me', isAuthenticatedUser, authorizeRoles('admin'), adminController.getAdminDetails);
router.put('/me/update', isAuthenticatedUser, authorizeRoles('admin'), adminController.updateAdminProfile);

// Protected routes for owner
router.get('/all', isAuthenticatedUser, authorizeRoles('owner'), adminController.getAllAdmins);
router.post('/create', isAuthenticatedUser, authorizeRoles('owner'), adminController.createAdmin);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), adminController.deleteAdmin);

module.exports = router;