const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/userControllers');
const { isAuthenticatedAdmin, authorizeRoles } = require('../../middleware/auth');

// User Routes
router.post('/', userController.addUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);
router.get('/me', isAuthenticatedAdmin, userController.getUserDetails);
router.put('/me/update', isAuthenticatedAdmin, userController.updateProfile);

// Admin Routes
router.get('/admin/users', isAuthenticatedAdmin, authorizeRoles('admin'), userController.getAllUsers);

router.route('/admin/user/:id')
  .get(isAuthenticatedAdmin, authorizeRoles('admin'), userController.getSingleUser)   // GET request to fetch user by ID
  .put(isAuthenticatedAdmin, authorizeRoles('admin'), userController.updateUserRole)  // PUT request to update user role
  .delete(isAuthenticatedAdmin, authorizeRoles('admin'), userController.deleteUser);  // DELETE request to delete user

module.exports = router;
