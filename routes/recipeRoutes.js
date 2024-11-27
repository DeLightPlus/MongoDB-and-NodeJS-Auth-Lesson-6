// routes/recipeRoutes.js
const express = require('express');
const { 
    createRecipe, 
    getAllRecipes, 
    getRecipeById, 
    updateRecipe, 
    deleteRecipe, 
    getRecipesByUserId
} = require('../controllers/recipeController');
const authenticateJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authRole');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Define API routes and link them to the controller functions
router.post('/', authenticateJWT, authorizeRole(['admin', 'user']), createRecipe);
router.get('/', authenticateJWT, getAllRecipes);
router.get('/:recipeId',  authenticateJWT, getRecipeById);
router.get('/user/:userId',  authenticateJWT, getRecipesByUserId);


router.put('/:recipeId', authenticateJWT, authorizeRole(['admin', 'user']), updateRecipe);
router.delete('/:recipeId', authenticateJWT, authorizeRole(['admin', 'user']), deleteRecipe);

module.exports = router;
