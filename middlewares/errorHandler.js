const mongoose = require('mongoose');
const {
  SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
} = require('../constants/errorStatuses');

const errorHandler = (err, req, res) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST).json({ message: 'Ошибка ID' });
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(NOT_FOUND).json({ message: 'Ресурс не найден' });
  }

  if (err.code === 11000) {
    return res
      .status(CONFLICT)
      .json({ message: 'Данный email уже зарегистрирован' });
  }

  if (err.code === 401) {
    return res.status(UNAUTHORIZED).json({ message: 'Недействительный токен' });
  }

  return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
};

module.exports = errorHandler;