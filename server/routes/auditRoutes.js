const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('userId', 'name email role') // ✅ Fetch Name, Email, and Role
            .sort({ createdAt: -1 })
            .limit(10); // Show last 10 activities

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

module.exports = router;