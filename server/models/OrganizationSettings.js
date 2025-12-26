const mongoose = require('mongoose');

const organizationSettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'My Company' },
  companyEmail: { type: String, default: 'admin@company.com' },
  address: { type: String, default: '' },
  
  payrollConfig: {
    payDay: { type: Number, default: 1 }, // Day of the month (e.g., 1st)
    pfRate: { type: Number, default: 12 }, // Percentage
    esiRate: { type: Number, default: 0.75 } // Percentage
  },
  
  taxSlabs: [
    {
      min: { type: Number },
      max: { type: Number },
      rate: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('OrganizationSettings', organizationSettingsSchema);