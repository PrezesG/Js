const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
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
    .get((req, res) => {
        // Assuming `user` is available in `req.user`
        const user = req.user;

        res.render('recipes/index', { user: user });
    });
router.route('/recipe/new')
    .get((req, res) => res.render('recipes/new')) // Show new recipe form
    .post(recipeController.createRecipe);
    
router.route('/recipe/:id')
    .get((req, res) => res.render('recipes/show')) // Show specific recipe
    .put((req, res) => res.render('recipes/edit')) // Show edit recipe form
    .delete(recipeController.deleteRecipe);

    
module.exports = router;