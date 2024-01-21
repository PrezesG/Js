const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
require('./src/db');

// Import routes
const indexRoutes = require('./src/routes/index');

// // Set EJS as templating engine
app.set('view engine', 'ejs');

// Use routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);

app.get('/dbStatus', (req, res) => {
  let state = 'Unknown';
  switch(mongoose.connection.readyState) {
    case 0: state = 'disconnected'; break;
    case 1: state = 'connected'; break;
    case 2: state = 'connecting'; break;
    case 3: state = 'disconnecting'; break;
  }
  res.send(`Database connection state: ${state}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});