// models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  cookingTime: { type: Number, required: true }, // in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // This should be ObjectId and reference the User model
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema); //Recipe => DatabaseName?!

module.exports = Recipe;
