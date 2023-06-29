const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../constants/errorStatuses');

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации' });
  }

  try {
    const payload = jwt.verify(token, 'super-secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации' });
  }
};

module.exports = auth;
