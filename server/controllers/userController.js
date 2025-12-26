const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ 1. Import the Logger
const { logAction } = require('../utils/logger'); 

// Create Employee
exports.createUser = async (req, res) => {
  try {
    // ✅ ADD 'name' to the request body destructuring
    const { name, email, password, role, designation, departmentId, salary } = req.body; 

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name || email.split('@')[0], // This ensures 'manya' is stored
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      status: 'ACTIVE'
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      departmentId: departmentId || null,
      designation,
      salary: salary || 0 
    });
    await newEmployee.save();

    // ✅ DETAILED LOGGING
    const adminId = req.user ? req.user.id : savedUser._id; // Who did this?
    await logAction(
      adminId, 
      "CREATE_USER", 
      `Created ${role}: ${name || email}`, 
      `Designation: ${designation}`
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Login (Updated)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ✅ DETAILED LOGGING
    await logAction(user._id, "LOGIN", "User Signed In", `Role: ${user.role}`);

    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... keep verifyUser, getEmployees, and getUsers as they are ...
exports.verifyUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
      const employees = await Employee.find().populate('userId', '-password').populate('departmentId');
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
};
  
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
};

// ✅ New: Update existing employee data
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params; // This is the Employee document _id
    const { designation, departmentId, salary } = req.body;

    // Update the Employee record
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { designation, departmentId, salary },
      { new: true } // Return the updated document
    ).populate('userId', 'name email');

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee record not found" });
    }

    res.json({ message: "Employee updated successfully", updatedEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};