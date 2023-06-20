/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const { NOT_FOUND } = require('./constants/errorStatuses');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '648dceec501afe40aa66200a',
  };

  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Ошибка запроса' });
});

app.listen(3000);
