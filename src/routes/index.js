const express = require('express');
const router = express.Router();

// Import controllers
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');

// User routes
router.route('/register')
    .get((req, res) => res.render('users/register')) // Show register page
    .post(userController.register); // Handle registration
   
router.route('/login')
    .get((req, res) => res.render('users/login')) // Show login page
    .post(userController.login); // Handle login

// Recipe routes
router.route('/recipes')
    .post(recipeController.createRecipe)
    .get((req, res) => res.render('recipes/index')); // Show all recipes

router.route('/recipe/new')
    .get((req, res) => res.render('recipes/new')); // Show new recipe form
    
router.route('/recipe/:id')
    .get((req, res) => res.render('recipes/show')) // Show specific recipe
    .put((req, res) => res.render('recipes/edit')) // Show edit recipe form
    .delete(recipeController.deleteRecipe);
module.exports = router;