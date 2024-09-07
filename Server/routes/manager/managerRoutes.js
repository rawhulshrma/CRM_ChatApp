const express = require('express');
const router = express.Router();
const managerController = require('../../controllers/manager/managerControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public routes
router.post('/login', managerController.loginManager);
router.get('/logout', managerController.logoutManager);

// Protected routes for manager
router.get('/me', isAuthenticatedUser, authorizeRoles('manager'), managerController.getManagerDetails);
router.put('/me/update', isAuthenticatedUser, authorizeRoles('manager'), managerController.updateManagerProfile);

// Protected routes for owner
router.get('/all', isAuthenticatedUser, authorizeRoles('owner'), managerController.getAllManagers);
router.post('/create', isAuthenticatedUser, authorizeRoles('owner'), managerController.createManager);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), managerController.deleteManager);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const managerController = require('../../controllers/manager/managerControllers');
// const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');


// router.post('/login', managerController.loginManager); // Update to manager login
// router.get('/logout', managerController.logoutManager); // Update to manager logout


// // Create Manager (Owner और Admin दोनों कर सकते हैं)
// router.post('/create', isAuthenticatedUser, authorizeRoles('owner', 'admin'), managerController.createManager);

// // Get Manager Details
// router.get('/me', isAuthenticatedUser, authorizeRoles('manager', 'admin', 'owner'), managerController.getManagerDetails);

// // Update Manager Profile
// router.put('/me/update', isAuthenticatedUser, authorizeRoles('manager', 'admin'), managerController.updateManagerProfile);

// // Delete Manager (केवल Owner कर सकता है)
// router.delete('/:id/delete', isAuthenticatedUser, authorizeRoles('owner'), managerController.deleteManager);

// router.patch('/:id/role', isAuthenticatedUser, authorizeRoles('owner'), managerController.updateManagerRole); // Update manager role route


// module.exports = router;