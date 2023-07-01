const Joi = require('joi');
const { BAD_REQUEST } = require('../constants/errorStatuses');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации' });
  }

  return next();
};

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri().required(),
});

const cardSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().uri().required(),
});

module.exports = {
  validateUserRequest: validateRequest(userSchema),
  validateCardRequest: validateRequest(cardSchema),
};
