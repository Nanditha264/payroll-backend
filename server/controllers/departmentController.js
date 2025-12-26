const Department = require('../models/Department');

// 1. GET ALL DEPARTMENTS (DEBUG VERSION)
exports.getDepartments = async (req, res) => {
  try {
    console.log("---------------------------------------");
    console.log("🔍 API CALL: Fetching Departments...");
    
    // Check Database Count
    const count = await Department.countDocuments();
    console.log(`📊 Database says: There are ${count} departments.`);

    if (count === 0) {
        console.log("⚠️ WARNING: The 'departments' collection is EMPTY.");
    }

    const departments = await Department.find();
    console.log("📦 Sending Data to Frontend:", JSON.stringify(departments, null, 2));
    console.log("---------------------------------------");

    res.json(departments);
  } catch (err) {
    console.error("❌ ERROR FETCHING DEPARTMENTS:", err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Department
exports.createDepartment = async (req, res) => {
  try {
    const { name, budget } = req.body;
    const newDept = new Department({ name, budget });
    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, budget } = req.body;
    const updatedDept = await Department.findByIdAndUpdate(
      req.params.id,
      { name, budget },
      { new: true }
    );
    res.json(updatedDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};