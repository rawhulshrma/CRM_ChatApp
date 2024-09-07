const chatModel = require('../../models/chat/chatModels');
const ErrorHandler = require('../../utils/errorHandler');

const sendMessage = async (req, res, next) => {
  const { receiverId, receiverName, receiverRole, message } = req.body;
  const { id: senderId, name: senderName, role: senderRole } = req.user;

  console.log('Request body:', req.body);
  console.log('Sender info:', req.user);

  try {
    if (!receiverId || !receiverName || !receiverRole) {
      return next(new ErrorHandler('Invalid receiver details', 400));
    }
    const newMessage = await chatModel.sendMessage(senderName, senderId, senderRole, receiverName, receiverId, receiverRole, message);
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(new ErrorHandler('Error sending message', 500));
  }
};

const getMessages = async (req, res, next) => {
  const { name: userName } = req.user;
  const otherUserId = req.params.userId;

  console.log('Fetching messages for:', { userName, otherUserId });

  try {
    const messages = await chatModel.getMessages(userName, otherUserId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(new ErrorHandler('Error fetching messages', 500));
  }
};

const deleteMessage = async (req, res, next) => {
  // Implement message deletion logic here
  // Only allow owners to delete messages
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage
};
