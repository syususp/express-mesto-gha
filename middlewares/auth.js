const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../constants/errorStatuses');

const auth = (req, res, next) => {
  const token = req.headers.cookie.replace('token=', '');

  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации, блок 1' });
  }

  try {
    const payload = jwt.verify(token, 'super-secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Ошибка авторизации, блок 2' });
  }
};

module.exports = auth;
