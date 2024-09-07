const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employee/employeeControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// Public routes
router.post('/login', employeeController.loginEmployee);
router.get('/logout', employeeController.logoutEmployee);

// Protected routes for employee
router.get('/me', isAuthenticatedUser, authorizeRoles('employee'), employeeController.getEmployeeDetails);
router.put('/me/update', isAuthenticatedUser, authorizeRoles('employee'), employeeController.updateEmployeeProfile);

// Protected routes for owner
router.get('/all', isAuthenticatedUser, authorizeRoles('owner'), employeeController.getAllEmployees);
router.post('/create', isAuthenticatedUser, authorizeRoles('owner'), employeeController.createEmployee);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), employeeController.deleteEmployee);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const employeeController = require('../../controllers/employee/employeeControllers');
// const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

// // Employee Login
// router.post('/login', employeeController.loginEmployee);

// // Employee Logout
// router.get('/logout', employeeController.logoutEmployee);

// // Create Employee (Only Owner and Admin can create employees)
// router.post('/create', isAuthenticatedUser, authorizeRoles('owner', 'admin'), employeeController.createEmployee);

// router.get('/all', isAuthenticatedUser, authorizeRoles('owner'), employeeController.getAllEmployee);
// // Get Employee Details
// router.get('/me', isAuthenticatedUser, authorizeRoles('employee', 'admin', 'owner'), employeeController.getEmployeeDetails);

// // Update Employee Profile
// router.put('/me/update', isAuthenticatedUser, authorizeRoles('employee', 'admin'), employeeController.updateEmployeeProfile);

// // Delete Employee (Only Owner can delete employees)
// router.delete('/:id/delete', isAuthenticatedUser, authorizeRoles('owner'), employeeController.deleteEmployee);

// // Update Employee Role
// router.patch('/:id/role', isAuthenticatedUser, authorizeRoles('owner'), employeeController.updateEmployeeRole);

// module.exports = router;
