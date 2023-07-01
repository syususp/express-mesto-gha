const Joi = require('joi');
const { BAD_REQUEST } = require('../constants/errorStatuses');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);
    return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации', errors: validationErrors });
  }

  return next();
};

const userSchema = Joi.object({
  about: Joi.string(),
  name: Joi.string().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri(),
});

const cardSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().uri().required(),
});

module.exports = {
  validateUserRequest: validateRequest(userSchema),
  validateCardRequest: validateRequest(cardSchema),
};

// const { celebrate, Joi } = require('celebrate');
// const { BAD_REQUEST } = require('../constants/errorStatuses');

// const userSchema = Joi.object({
//   about: Joi.string(),
//   name: Joi.string().min(2).max(30),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
//   avatar: Joi.string().uri(),
// });

// const cardSchema = Joi.object({
//   name: Joi.string().required(),
//   link: Joi.string().uri().required(),
// });

// const validateUserRequest = celebrate(userSchema, { abortEarly: false });
// const validateCardRequest = celebrate(cardSchema, { abortEarly: false });

// module.exports = {
//   validateUserRequest,
//   validateCardRequest,
// };
