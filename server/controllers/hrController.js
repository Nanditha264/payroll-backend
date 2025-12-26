const Employee = require('../models/Employee');
const User = require('../models/User');

exports.getHRStats = async (req, res) => {
  try {
    // 1. Get Total Employees count
    const totalEmployees = await Employee.countDocuments();

    // 2. Calculate Total Monthly Payroll (Sum of all salaries)
    const payrollData = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
    ]);
    const monthlyPayroll = payrollData.length > 0 ? payrollData[0].totalSalary : 0;

    // 3. Get Department Distribution
    // This groups employees by Department ID and counts them
    const deptDist = await Employee.aggregate([
      {
        $lookup: {
            from: "departments", // Assumes your collection is named 'departments'
            localField: "departmentId",
            foreignField: "_id",
            as: "department"
        }
      },
      { $unwind: "$department" },
      {
        $group: {
          _id: "$department.name",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format data for the frontend
    res.json({
      totalEmployees,
      monthlyPayroll,
      departmentDistribution: deptDist,
      pendingLeaves: 5 // Placeholder until we build the Leave system fully
    });

  } catch (err) {
    console.error("HR Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch HR stats" });
  }
};