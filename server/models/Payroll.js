const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true }, // e.g., "May 2024"
  year: { type: Number, required: true },
  
  // Earnings
  basic: { type: Number, required: true },
  hra: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  grossEarnings: { type: Number, required: true },
  
  // Deductions
  pf: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  lop: { type: Number, default: 0 }, // Loss of Pay
  totalDeductions: { type: Number, required: true },
  
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'PAID'], default: 'DRAFT' }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);