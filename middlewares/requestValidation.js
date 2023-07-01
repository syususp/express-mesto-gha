const Joi = require('joi');
const { BAD_REQUEST } = require('../constants/errorStatuses');
const User = require('../models/user');

const validateRequest = (schema) => async (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации', errors: error.details });
  }

  return next();
};

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri(),
}).custom(async (value) => {
  const { email } = value;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Данный email уже зарегистрирован');
  }
  return value;
});

const cardSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().uri().required(),
});

module.exports = {
  validateUserRequest: validateRequest(userSchema),
  validateCardRequest: validateRequest(cardSchema),
};
