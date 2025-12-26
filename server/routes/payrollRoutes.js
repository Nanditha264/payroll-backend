const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPayrollStats, createPayroll } = require('../controllers/payrollController');

router.get('/', protect, getPayrollStats);
router.post('/', protect, createPayroll);

module.exports = router;