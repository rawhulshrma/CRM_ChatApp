const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/invoice/invoiceControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public routes (if applicable, otherwise remove or adjust)
router.get('/all', isAuthenticatedUser, authorizeRoles('owner', 'admin', 'employee', 'manager'), invoiceController.getAllInvoices);

// Protected routes for owner
router.post('/', isAuthenticatedUser, authorizeRoles('owner'), invoiceController.addInvoice);
router.put('/:id/update', isAuthenticatedUser, authorizeRoles('owner'), invoiceController.updateInvoice);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), invoiceController.deleteInvoice);

// Protected routes for admin
router.get('/:id', isAuthenticatedUser, authorizeRoles('admin', 'owner', 'employee', 'manager'), invoiceController.getInvoiceById);

// Protected routes for employee and manager (only view)
router.get('/view/:id', isAuthenticatedUser, authorizeRoles('employee', 'manager', 'admin', 'owner'), invoiceController.getInvoiceById);

module.exports = router;
