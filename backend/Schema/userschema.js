const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true 
  },
  height: {
    type: Number,
    required: true 
  },
  weight: {
    type: Number,

    required: true
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'none'],
    required: true
  },
  pregnancy: {
    type: String,
    default: null 
  },
  token: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
