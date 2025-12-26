const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateEmployee } = require('../controllers/userController');
const { 
    createUser, 
    loginUser, 
    verifyUser, 
    getUsers,      // We use this for the list
    getEmployees   // We might use this for a different route later
} = require('../controllers/userController');

// --- POST Routes ---
router.post('/', protect, createUser);       
router.post('/login', loginUser);            

// --- GET Routes ---
router.get('/verify', protect, verifyUser);  

// ✅ CORRECT: Point the root '/' to getUsers (for Admin Panel)
router.get('/', protect, getUsers);      

// (Optional) If you still need the employee list for HR, give it a different path:
router.get('/employees', protect, getEmployees); 

router.put('/employees/:id', protect, updateEmployee);

module.exports = router;