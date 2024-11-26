const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user and send JWT
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try 
  {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) 
    {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      userId: user.id,
      role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the JWT as a cookie (instead of just in the response body)
    res.cookie('jwt_auth', token, {
      httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Set secure flag for production
      maxAge: 3600000, // Cookie expires after 1 hour
    });

    res.json({ token });

  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only route to update a user's role to 'admin'
exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Ensure only admin can update the role
  if (req.user.role !== 'admin') 
  {
    return res.status(403).json({ message: 'Forbidden: You do not have permission' });
  }

  if (role !== 'admin' && role !== 'user') 
  {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try 
  {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

