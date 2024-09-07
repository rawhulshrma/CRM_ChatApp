const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');
const ownerController = require('../../controllers/owner/ownerControllers');

// Public routes
router.post('/login', ownerController.loginOwner);
router.get('/logout', ownerController.logoutOwner);

// Protected routes for owner
router.get('/me', isAuthenticatedUser, authorizeRoles('owner'), ownerController.getOwnerDetails);
router.put('/me/update', isAuthenticatedUser, authorizeRoles('owner'), ownerController.updateOwnerProfile);

module.exports = router;