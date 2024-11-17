const express = require('express');
const { registerUser, loginUser, updateUserRole } = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authRole');

const router = express.Router();

// User registration
router.post('/register', registerUser);
// User login
router.post('/login', loginUser);

router.put('/users/:userId/role', authenticateJWT, authorizeRole('admin'), updateUserRole)


module.exports = router;
