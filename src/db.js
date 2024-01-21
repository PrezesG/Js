require('dotenv').config();
const mongoose = require('mongoose');

const login = process.env.DB_USERNAME;
const pass = process.env.DB_PASSWORD;
const name = process.env.DB_NAME;
mongoose.connect("mongodb+srv://"+login+":"+ pass +"@cluster0.2pegah7.mongodb.net/"+ name +"?retryWrites=true&w=majority")


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Błąd połączenia:'));
db.once('open', function() {
  console.log('Połączenie z bazą danych ' + name + ' OK');
});