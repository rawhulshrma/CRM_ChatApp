// routes/authRoutes.js
const express = require('express');
const { login, getMe, logout, updateProfile } = require('../../controllers/auth/authControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isAuthenticatedUser, getMe);
router.put('/update', isAuthenticatedUser, updateProfile);

router.get('/owner', isAuthenticatedUser, authorizeRoles('owner'), (req, res) => {
  res.status(200).json({ success: true, message: 'Owner content' });
});

router.get('/admin', isAuthenticatedUser, authorizeRoles('owner', 'admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Admin content' });
});

router.get('/manager', isAuthenticatedUser, authorizeRoles('owner', 'admin', 'manager'), (req, res) => {
  res.status(200).json({ success: true, message: 'Manager content' });
});

router.get('/employee', isAuthenticatedUser, authorizeRoles('owner', 'admin', 'manager', 'employee'), (req, res) => {
  res.status(200).json({ success: true, message: 'Employee content' });
});

module.exports = router;