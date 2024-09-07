const express = require('express');
const router = express.Router();
const customerControllers = require('../../controllers/application/customerControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Admin Routes
router.post('/', isAuthenticatedUser, authorizeRoles('owner'),customerControllers.addCustomer);
router.get('/', isAuthenticatedUser, authorizeRoles('owner'),customerControllers.getAllCustomers );
router.get('/:id', isAuthenticatedUser, authorizeRoles('owner'),customerControllers.getCustomerDetails);

module.exports = router;



