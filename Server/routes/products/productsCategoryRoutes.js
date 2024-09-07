const express = require('express');
const router = express.Router();
const productCategoryController = require('../../controllers/products/productsCategoryController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public Routes (accessible by anyone)
router.get('/all', productCategoryController.getAllProductCategory);
router.get('/:id', productCategoryController.getProductCategoryById);

// Protected Routes (accessible only by 'owner' role)
router.post('/', isAuthenticatedUser, authorizeRoles('owner'), productCategoryController.addProductCategory);
router.put('/:id', isAuthenticatedUser, authorizeRoles('owner'), productCategoryController.updateProductCategory);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), productCategoryController.deleteProductCategory);

module.exports = router;
