const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // Format: "Dec 2, 2024"
  day: { type: String, required: true },  // Format: "Mon"
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Weekend', 'LOP', 'Holiday'], 
    default: 'Present' 
  },
  clockIn: { type: String, default: '-' },
  clockOut: { type: String, default: '-' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);