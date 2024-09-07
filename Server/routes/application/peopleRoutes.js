const express = require('express');
const router = express.Router();
const peopleController = require('../../controllers/application/peopleController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Admin Routes
router.post('/', isAuthenticatedUser, authorizeRoles('owner'), peopleController.addPeople);
router.get('/all', isAuthenticatedUser, authorizeRoles('owner'), peopleController.getAllPeople);
// router.get('/:id', isAuthenticatedUser, authorizeRoles('owner'), peopleController.);

module.exports = router;



module.exports = router;

// // User Routes
// router.post('/', userController.addUser);
// router.put('/me/update', isAuthenticatedUser, userController.updateProfile);

// // Admin Routes
// router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), userController.getAllUsers);

// router.route('/admin/user/:id')
//   .get(isAuthenticatedUser, authorizeRoles('admin'), userController.getSingleUser)   // GET request to fetch user by ID
//   .put(isAuthenticatedUser, authorizeRoles('admin'), userController.updateUserRole)  // PUT request to update user role
//   .delete(isAuthenticatedUser, authorizeRoles('admin'), userController.deleteUser);  // DELETE request to delete user


