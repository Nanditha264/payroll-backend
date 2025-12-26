// server/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getEmployeeDashboard, getEmployeeAttendance,getEmployeePayslips ,applyLeave} = require('../controllers/employeeController');

// This matches: GET /api/employee/dashboard
router.get('/dashboard', protect, getEmployeeDashboard);

// This matches: GET /api/employee/attendance
router.get('/attendance', protect, getEmployeeAttendance);

router.post('/apply-leave', protect, applyLeave);

router.get('/payslips', protect, getEmployeePayslips);

module.exports = router;