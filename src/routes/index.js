const express = require('express');
const router = express.Router();

// Import controllers
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');

// Define routes
router.post('/recipe', recipeController.createRecipe);
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipe/:id', recipeController.getRecipe);
router.put('/recipe/:id', recipeController.updateRecipe);
router.delete('/recipe/:id', recipeController.deleteRecipe);


router.get('/register', userController.showRegister); // Add this line
router.get('/login', userController.showLogin); // Add this line

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;