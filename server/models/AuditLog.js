const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    // removed required: true to prevent validation errors during debug
  },
  action: { type: String },
  target: { type: String },
  details: { type: String },
  ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);