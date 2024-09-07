// routes/chat/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chat/chatController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');

router.post('/send', isAuthenticatedUser, chatController.sendMessage);
router.get('/messages/:userId', isAuthenticatedUser, chatController.getMessages);
router.delete('/delete/:messageId', isAuthenticatedUser, authorizeRoles('owner'), chatController.deleteMessage);

module.exports = router;