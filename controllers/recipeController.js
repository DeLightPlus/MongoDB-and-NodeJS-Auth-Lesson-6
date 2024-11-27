const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions, cookingTime } = req.body;
  try {
    console.log('createdBy:' , req.user.userId);
    // Check if the recipe already exists (optional)
    const existingRecipe = await Recipe.findOne({ name });
    if (existingRecipe) 
    {
      return res.status(400).json({ message: 'Recipe already exists' });
    }    
    
    const newRecipe = new Recipe({
      // ...req.body,
      name,
      ingredients,
      instructions,
      cookingTime,
      createdBy: req.user.userId,  // Ensure req.user.id is available via authentication middleware
    });
    
    await newRecipe.save();
    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: newRecipe,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating recipe', error: err.message });
  }
};

// Get all recipes with pagination
exports.getAllRecipes = async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  try {
    const recipes = await Recipe.find()
      .populate('createdBy', 'username email')
      .skip((page - 1) * size)
      .limit(Number(size));

    const totalRecipes = await Recipe.countDocuments();
    res.json({
      recipes,
      totalRecipes,
      page,
      totalPages: Math.ceil(totalRecipes / size),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err.message });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  console.log('Fetching recipe with ID:', recipeId);  // Log recipeId

  try 
  {
    // Ensure the recipeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) 
    {
      return res.status(400).json({ message: 'Invalid recipe ID format' });
    }

    // Use findById for easier retrieval of a single document
    const recipe = await Recipe.findById(recipeId).populate('createdBy', 'username email');
    // const recipe = await Recipe.find({"_id": recipeId})
    
    if (!recipe) 
    {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ recipe });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Error fetching recipe', error: err.message });
  }
};

// Get recipes by User ID
exports.getRecipesByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching recipes created by user:', userId);  // Log userId

  try {
    // Ensure the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const recipes = await Recipe.find({ createdBy: userId }).populate('createdBy', 'username email');

    if (recipes.length === 0) 
    {
      return res.status(404).json({ message: 'No recipes found for this user' });
    }

    res.status(200).json({ recipes });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Error fetching recipes', error: err.message });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is authorized (either the creator or admin)
    if (recipe.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is authorized (either the creator or admin)
    if (recipe.createdBy.toString() !== req.user.id && req.user.role !== 'admin') 
    {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this recipe' });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) 
    {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Error deleting recipe', error: err.message });
  }
};
