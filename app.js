const express = require('express');
const mongoose = require('mongoose');
const { getUsers, getUserById, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const app = express();

app.listen(3001);

app.get('/users', getUsers);

app.get('/users/:userId', getUserById);

app.post('/users', createUser);
