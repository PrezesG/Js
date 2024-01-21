const express = require('express');
const app = express();
const indexRoutes = require('./src/routes/index');
const User = require('./src/models/User');
const mongoose = require('mongoose');
const { name } = require('ejs');
const port = 3000;
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('./src/db');

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', indexRoutes);

app.get('/', function (req, res) {
    res.render('HomePage'); // render HomePage.ejs
});
app.get('/users/login', (req, res) => {
    res.render('users/login');
})


app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    res.send("An error occurred");
                } else if (isMatch) {
                    const token = jwt.sign({ id: user._id }, 'your_jwt_secret'); // Include the user's ID in the token
                    res.cookie('token', token);
                    res.redirect('/recipes');
                } else {
                    res.send("Invalid username or password");
                }
            });
        } else {
            res.send("Invalid username or password");
        }
    } catch (err) {
        console.log(err);
        res.send("An error occurred");
    }
});
//app.post('/recipe/new', (req, res) => {
//    const token = req.cookies.token;
//    console.log('Token:', token); // Log the token
//    if (!token) {
//        return res.status(403).send({ auth: false, message: 'No token provided.' });
//    }
//    jwt.verify(token, 'your_jwt_secret', async (err, decodedToken) => {
//        if (err) {
//            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//        }
//        console.log('Decoded token:', decodedToken); // Log the decoded token
//        const user = decodedToken.id;
//        const { title, ingredients, instructions } = req.body;
//        console.log('Request body:', req.body); // Log the request body

//        if (!title) console.log('Missing title');
//        if (!ingredients) console.log('Missing ingredients');
//        if (!instructions) console.log('Missing instructions');
//        if (!user) console.log('Missing user');
//        if (title && ingredients && instructions && user) {
//            const newRecipe = new Recipe({ title, ingredients, instructions, user });
//            try {
//                await newRecipe.save();
//                // Recipe created successfully
//                res.redirect('/recipes');
//            } catch (err) {
//                // Handle error
//                console.log(err);
//                res.redirect('/recipe/new');
//            }
//        } else {
//            console.log('Missing required fields');
//            res.redirect('/recipe/new');
//        }
//    });
//});
//app.get('/recipes', (req, res) => {
//    const token = req.cookies.token;
//    if (token) {
//        jwt.verify(token, 'your_jwt_secret', (err, user) => {
//            if (err) {
//                return res.sendStatus(403);
//            }
//            res.render('recipes/index', { user: user });
//        });
//    } else {
//        res.render('recipes/index');
//    }
//});
app.get('/users/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/users/login');
});

app.get('/users/register', (req, res) => {
    res.render('users/register');
})

app.post('/users/register', async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    await User.create(data);

    res.render('users/login', { username: data.username });
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
