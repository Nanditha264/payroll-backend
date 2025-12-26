const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getHRStats } = require('../controllers/hrController');
const Leave = require('../models/Leave'); 

router.get('/stats', protect, getHRStats);

// ✅ NEW: Route to fetch all leave requests (with User details)
router.get('/leaves', protect, async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', 'email name').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update leave status (Approve/Reject)
router.put('/leaves/:id', protect, async (req, res) => {
  try {
    const { status } = req.body; 
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ message: `Leave ${status.toLowerCase()} successfully`, updatedLeave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;