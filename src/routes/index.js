const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');


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
                    res.render('recipes/show', { recipe: foundRecipe, user: user });
                })
                .catch(err => {
                    console.log(err);
                    res.send("An error occurred");
                });
        });
    })
router.get('/recipes/:id/edit', (req, res) => {
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
                
                res.render('recipes/edit', { recipe: foundRecipe, user: user });
            })
            .catch(err => {
                console.log(err);
                res.send("An error occurred");
            });
    });
});
router.post('/recipes/:id/edit', (req, res) => {
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
            .then(async foundRecipe => {
                foundRecipe.title = req.body.title;
                foundRecipe.ingredients = req.body.ingredients;
                foundRecipe.instructions = req.body.instructions;
                await foundRecipe.save();
                res.redirect(`/recipes/${foundRecipe.id}`);
            })
            .catch(err => {
                console.log(err);
                res.send("An error occurred");
            });
    });
});
router.delete('/recipes/:id', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'your_jwt_secret', async (err, user) => {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            req.user = user;
            await recipeController.deleteRecipe(req, res);
        });
    } else {
        res.status(403).send({ auth: false, message: 'No token provided.' });
    }
});
module.exports = router;