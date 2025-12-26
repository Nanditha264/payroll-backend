const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// 1. Get Payroll for a specific month (or Generate Preview)
exports.getPayrollStats = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Check if payroll already exists for this month/year
    let records = await Payroll.find({ month, year }).populate({
        path: 'employeeId',
        populate: { path: 'userId', select: 'email' }
    });

    // If no records exist, generate a PREVIEW based on employees
    if (records.length === 0) {
        const employees = await Employee.find().populate('userId', 'email');
        
        records = employees.map(emp => {
            // --- THIS IS THE NEW LOGIC YOU REQUESTED ---
            // Use real salary from DB (default to 0 if not set)
            const basic = emp.salary || 0; 
            
            // Standard Breakdown Calculation
            const hra = basic * 0.4;          // 40% of Basic
            const allowances = basic * 0.2;   // 20% of Basic
            const gross = basic + hra + allowances;
            
            const pf = basic * 0.12;          // 12% PF
            // Simple Tax Logic: 10% tax if gross > 50k, else 0
            const tax = gross > 50000 ? gross * 0.1 : 0; 
            
            return {
                _id: "preview_" + emp._id, // Fake ID for frontend key
                employeeId: emp,
                basic, 
                hra, 
                allowances,
                grossEarnings: gross,
                pf, 
                tax, 
                lop: 0,
                totalDeductions: pf + tax,
                netSalary: gross - (pf + tax),
                status: 'PREVIEW'
            };
            // -------------------------------------------
        });
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Confirm & Lock Payroll
exports.createPayroll = async (req, res) => {
  try {
    const { month, year, records } = req.body;
    
    // Save all records at once
    const savedRecords = await Payroll.insertMany(records.map(r => ({
        employeeId: r.employeeId._id || r.employeeId, // Handle populated vs raw ID
        month, year,
        basic: r.basic, hra: r.hra, allowances: r.allowances,
        grossEarnings: r.grossEarnings,
        pf: r.pf, tax: r.tax, lop: r.lop,
        totalDeductions: r.totalDeductions,
        netSalary: r.netSalary,
        status: 'PAID'
    })));

    res.status(201).json({ message: "Payroll Locked Successfully", data: savedRecords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};