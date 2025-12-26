const Employee = require('../models/Employee');
const User = require('../models/User');
const Leave = require('../models/Leave'); 
const Payroll = require('../models/Payroll'); 
const Attendance = require('../models/Attendance');

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id })
      .populate('userId', 'name email role status') // Fetch name from User model
      .populate('departmentId', 'name');

    if (!employee) {
      // Fallback if the employee record doesn't exist yet
      const user = await User.findById(req.user.id).select('-password');
      return res.json({
        profile: { 
          userId: user, 
          employeeId: "PENDING", 
          designation: "New Joiner" 
        },
        payroll: { netSalary: 0, grossEarnings: 0, totalDeductions: 0 },
        leaveStats: { total: 20, used: 0, pending: 0, balance: 20 }
      });
    }

    const latestPayroll = await Payroll.findOne({ employeeId: employee._id }).sort({ createdAt: -1 });
    const leaves = await Leave.find({ userId: req.user.id });
    
    res.json({
      profile: employee,
      payroll: latestPayroll || { netSalary: 70500, grossEarnings: 85000, totalDeductions: 14500 },
      leaveStats: {
        total: 20,
        used: leaves.filter(l => l.status === 'APPROVED').length,
        pending: leaves.filter(l => l.status === 'PENDING').length,
        balance: 12 
      },
      leaves: leaves 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    // Find attendance records for the logged-in user
    // Sorted by date descending (latest first)
    const attendanceRecords = await Attendance.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    
    // 1. Find the employee profile
    let employee = await Employee.findOne({ userId: req.user.id });
    
    // 2. If no profile exists, do not try to create a half-empty one.
    // Instead, inform the user they need an HR-created profile first.
    if (!employee) {
      return res.status(400).json({ 
        error: "Employee profile not found. Please contact HR to complete your onboarding." 
      });
    }

    // 3. Create the leave record using the found employee's ID
    const newLeave = new Leave({
      userId: req.user.id,
      employeeId: employee._id, // Links to the Employee model
      type, 
      startDate, 
      endDate, 
      reason,
      status: 'PENDING'
    });

    await newLeave.save();
    res.status(201).json({ message: "Leave request submitted successfully" });
  } catch (err) {
    // Log the actual error to your terminal so you can see if it's a validation error
    console.error("Leave Application Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployeePayslips = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // Find all payroll records linked to this employee, sorted by latest first
    const payslips = await Payroll.find({ employeeId: employee._id }).sort({ createdAt: -1 });
    
    res.json(payslips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};