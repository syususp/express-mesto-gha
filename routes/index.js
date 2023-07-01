const express = require('express');
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const router = express.Router();

const userSchema = Joi.object().keys({
  about: Joi.string(),
  name: Joi.string().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri(),
});

const cardSchema = Joi.object().keys({
  name: Joi.string().required(),
  link: Joi.string().uri().required(),
});

router.use('/users', celebrate({ body: userSchema }), userRoutes);
router.use('/cards', celebrate({ body: cardSchema }), cardRoutes);

module.exports = router;
