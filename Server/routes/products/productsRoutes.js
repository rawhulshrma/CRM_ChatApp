const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/products/productsController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public routes
router.get('/all', productsController.getAllProducts); // Get all products, accessible to everyone
router.get('/:id', productsController.getProductDetails); // Get product details, accessible to everyone

// Owner-specific routes
router.post('/', isAuthenticatedUser, authorizeRoles('owner'), productsController.addProduct); // Add product, accessible only to owner
router.put('/update/:id', isAuthenticatedUser, authorizeRoles('owner'), productsController.updateProduct); // Update product, accessible only to owner
router.delete('/delete/:id', isAuthenticatedUser, authorizeRoles('owner'), productsController.deleteProduct); // Delete product, accessible only to owner

// Reviews
router.post('/review', isAuthenticatedUser, productsController.createProductReview); // Create product review, accessible to authenticated users
router.get('/reviews/:product_id', productsController.getProductReviews); // Get product reviews, accessible to everyone
router.delete('/review/:id', isAuthenticatedUser, productsController.deleteReview); // Delete review, accessible to authenticated users

module.exports = router;
