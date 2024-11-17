// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try 
  {
    await mongoose.connect(process.env.DB_URL)     

    console.log('MongoDB connected...');
  } 
  catch (err) 
  {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // Exit the app with failure
  }
};

module.exports = connectDB;
