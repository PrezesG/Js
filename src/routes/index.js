const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// Import controllers
const mongoose = require('mongoose');
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');

//router.post('/users/register', async (req, res) => {
//    const { username, password } = req.body;
//    const user = new User({ username, password });
//    try {
//        await user.sav e();
//        // User registered successfully, redirect to login page
//        res.redirect('/users/login');
//    } catch (err) {
//        // Handle error
//        console.log(err);
//        res.redirect('/users/register');
//    }
//});

//router.route('/login')
//    .get((req, res) => res.render('users/login')) // Show login page
//    .post(userController.login); // Handle login

// Recipe routes
//router.route('/recipes')
//    .get((req, res) => {
//        // Assuming `user` is available in `req.user`
//        const user = req.user;

//        res.render('recipes/index', { user: user });
//    });
router.get('/recipe/new', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            res.render('recipes/new', { user: user });
        });
    } else {
        res.redirect('/users/login');
    }
});

router.post('/recipe/new', (req, res) =>  {
const token = req.cookies.token;
console.log('Token:', token); // Log the token
if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
}
jwt.verify(token, 'your_jwt_secret', async (err, decodedToken) => {
    if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    console.log('Decoded token:', decodedToken); // Log the decoded token
    const user = decodedToken.id;
    const { title, ingredients, instructions } = req.body;
    console.log('Request body:', req.body); // Log the request body

    if (!title) console.log('Missing title');
    if (!ingredients) console.log('Missing ingredients');
    if (!instructions) console.log('Missing instructions');
    if (!user) console.log('Missing user');
    if (title && ingredients && instructions && user) {
        const newRecipe = new Recipe({ title, ingredients, instructions, user });
        try {
            await newRecipe.save();
            // Recipe created successfully
            res.redirect('/recipes');
        } catch (err) {
            // Handle error
            console.log(err);
            res.redirect('/recipe/new');
        }
    } else {
        console.log('Missing required fields');
        res.redirect('/recipe/new');
    }
});
});

router.get('/recipes', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, 'your_jwt_secret', async (err, decodedToken) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const user = await User.findById(decodedToken.id);
        const recipes = await Recipe.find({ user: user._id });
        res.render('recipes/index', { user, recipes });
    });
});
//router.route('/recipe/:id')
//    .get((req, res) => res.render('recipes/show')) // Show specific recipe
//    .put((req, res) => res.render('recipes/edit')) // Show edit recipe form
//    .delete(recipeController.deleteRecipe);


router.route('/recipes/:id')
    .get((req, res) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        }
        jwt.verify(token, 'your_jwt_secret', async (err, decodedToken) => {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            const user = await User.findById(decodedToken.id);
            Recipe.findById(req.params.id)
                .then(foundRecipe => {
                    // Render the 'show' view with the found recipe and user
                    res.render('recipes/show', { recipe: foundRecipe, user: user });
                })
                .catch(err => {
                    console.log(err);
                    res.send("An error occurred");
                });
        });
    })
    .delete(recipeController.deleteRecipe);



    
module.exports = router;