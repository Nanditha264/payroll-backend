const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: { type: String, required: true },
  salary: { type: Number, required: true, default: 0 }, // <--- MUST BE HERE
  dateOfJoining: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);