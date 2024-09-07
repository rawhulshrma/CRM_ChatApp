const express = require('express');
const router = express.Router();
const currencyController = require('../../controllers/settings/currencyControllers.js');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth.js');
const { validateCurrencyId } = require('../../middleware/validateCurrencyId.js');

// Public Routes
router.get('/all', currencyController.getAllCurrency);
router.get('/:id', validateCurrencyId, currencyController.getCurrencyById);

// Protected Routes (Owner only)
router.use(isAuthenticatedUser, authorizeRoles('owner'));
router.post('/', currencyController.addCurrency);
router.put('/:id', validateCurrencyId, currencyController.updateCurrency);
router.delete('/:id', validateCurrencyId, currencyController.deleteCurrency);

module.exports = router;
