const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../constants/errorStatuses');

const auth = (req, res, next) => {
  const tokenString = req.headers.cookie;

  if (!tokenString) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации' });
  }

  const token = tokenString.replace('token=', '');

  try {
    const payload = jwt.verify(token, 'super-secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации.' });
  }
};

module.exports = auth;
