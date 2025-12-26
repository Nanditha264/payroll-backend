const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import the functions
const { 
  getDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} = require('../controllers/departmentController');
    
// Define the API endpoints
router.get('/', protect, getDepartments);
router.post('/', protect, createDepartment);
router.put('/:id', protect, updateDepartment);
router.delete('/:id', protect, deleteDepartment);

module.exports = router;