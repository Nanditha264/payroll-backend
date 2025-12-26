const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'System User' },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'HR', 'EMPLOYEE'], 
    default: 'EMPLOYEE',
    required: true
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'LOCKED'], 
    default: 'ACTIVE' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);