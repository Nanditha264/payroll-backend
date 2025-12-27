const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes'); // Ensure this file exists
const organizationRoutes = require('./routes/organizationRoutes'); // Ensure this file exists
const hrRoutes = require('./routes/hrRoutes'); // Ensure this file exists
const payrollRoutes = require('./routes/payrollRoutes'); // Ensure this file exists
const auditRoutes = require('./routes/auditRoutes'); // Ensure this file exists
const employeeRoutes = require('./routes/employeeRoutes'); // Ensure this file exists

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors({
  // ✅ Fixed the missing quote after .app
  origin: ['https://payroll-frontend-alpha.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// --- Routes Configuration ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/employee', employeeRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
