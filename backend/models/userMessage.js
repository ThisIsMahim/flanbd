const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  }
});

module.exports = mongoose.model('UserMessage', userMessageSchema);