const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, target, details, ipAddress = '127.0.0.1') => {
  console.log(`📝 LOGGER CALLED: Action=${action}, User=${userId}`);

  try {
    // Force create a log entry
    const newLog = await AuditLog.create({
      userId: userId,
      action: action,
      target: target,
      details: details,
      ipAddress: ipAddress
    });

    console.log(`✅ DATABASE SUCCESS: Log created with ID: ${newLog._id}`);
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err);
  }
};

module.exports = { logAction };