const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const port = 3000;
require('./src/db');
const indexRoutes = require('./src/routes/index');

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
// Use express-session middleware
app.use(session({
  secret: secret, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if you're using HTTPS
}));


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoutes);



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});