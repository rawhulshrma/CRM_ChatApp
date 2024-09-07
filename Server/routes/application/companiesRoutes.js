const express = require('express');
const router = express.Router();
const companiesController = require('../../controllers/application/companiesController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Admin Routes for Companies
router.post('/', isAuthenticatedUser, authorizeRoles('owner'), companiesController.addCompanies);
router.get('/', isAuthenticatedUser, authorizeRoles('owner'), companiesController.getAllCompanies);
router.get('/:id', isAuthenticatedUser, authorizeRoles('owner'), companiesController.getCompaniesDetails);

module.exports = router;