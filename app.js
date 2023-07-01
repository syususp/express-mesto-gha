/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const routes = require('./routes/index');
const { NOT_FOUND } = require('./constants/errorStatuses');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  '/signin',
  // celebrate({
  //   body: Joi.object().keys({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required(),
  //   }),
  // }),
  login,
);

app.post(
  '/signup',
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30).required(),
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required(),
  //     avatar: Joi.string().uri(),
  //   }),
  // }),
  createUser,
);

app.use(auth);
app.use(routes);
app.use(errorHandler);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Ошибка запроса' });
});

app.listen(3000);
