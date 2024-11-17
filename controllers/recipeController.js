const Recipe = require('../models/Recipe');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions, cookingTime } = req.body;
  try {
    // Check if the recipe already exists (optional)
    const existingRecipe = await Recipe.findOne({ name });
    if (existingRecipe) {
      return res.status(400).json({ message: 'Recipe already exists' });
    }

    const newRecipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,  // Ensure req.user.id is available via authentication middleware
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
  try {
    const recipe = await Recipe.findById(recipeId).populate('createdBy', 'username email');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipe', error: err.message });
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
    if (recipe.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this recipe' });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipe', error: err.message });
  }
};
