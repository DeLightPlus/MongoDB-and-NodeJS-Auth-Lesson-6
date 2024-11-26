const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json()); // To parse incoming JSON bodies
app.use(cookieParser()); // To parse cookies

// Connect to MongoDB
connectDB();

// Use routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// Error Handling Middleware (generic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5027;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
