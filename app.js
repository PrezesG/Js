const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
require('./src/db');
const indexRoutes = require('./src/routes/index');
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if your using https
}));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoutes);



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});