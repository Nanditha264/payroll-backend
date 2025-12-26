const OrganizationSettings = require('../models/OrganizationSettings');

// Get Settings (Create default if not exists)
exports.getSettings = async (req, res) => {
  try {
    let settings = await OrganizationSettings.findOne();
    
    if (!settings) {
      settings = new OrganizationSettings({
        companyName: 'Default Company', // Temporary default
        payrollConfig: { payDay: 1, pfRate: 12, esiRate: 0.75 },
        taxSlabs: []
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Settings (Fix: Create if missing)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await OrganizationSettings.findOne();

    // If no settings exist yet, create a new record
    if (!settings) {
        settings = new OrganizationSettings(req.body);
    } else {
        // Explicitly update fields
        settings.companyName = req.body.companyName;
        settings.companyEmail = req.body.companyEmail;
        settings.address = req.body.address;
        settings.payrollConfig = req.body.payrollConfig;
        settings.taxSlabs = req.body.taxSlabs;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
    
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};