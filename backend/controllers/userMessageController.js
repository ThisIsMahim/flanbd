const UserMessage = require('../models/userMessage');
const ErrorHandler = require('../utils/errorHandler');

// Create new message
exports.createMessage = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const userMessage = await UserMessage.create({
      name,
      phone,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: userMessage
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Get all messages (for admin)
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await UserMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Delete message
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await UserMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return next(new ErrorHandler('Message not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Update message status (mark as read/archived)
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await UserMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return next(new ErrorHandler('Message not found', 404));
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};