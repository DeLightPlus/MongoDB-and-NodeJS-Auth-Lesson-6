// routes/recipeRoutes.js
const express = require('express');
const { 
    createRecipe, 
    getAllRecipes, 
    getRecipeById, 
    updateRecipe, 
    deleteRecipe 
} = require('../controllers/recipeController');
const authenticateJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authRole');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Define API routes and link them to the controller functions
router.post('/', authenticateJWT, authorizeRole(['admin']), createRecipe);
router.get('/', authenticateJWT, getAllRecipes);
router.get('/:id',  authenticateJWT, getRecipeById);
router.put('/:id', authenticateJWT, authorizeRole(['admin', 'user']), updateRecipe);
router.delete('/:id', authenticateJWT, authorizeRole(['admin', 'user']), deleteRecipe);

module.exports = router;
