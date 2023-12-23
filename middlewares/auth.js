const jwt = require('jsonwebtoken');
const UnautorizedError = require('../errors/UnautorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // throw new UnautorizedError('Необходима авторизация');
    return res
      .status(UnautorizedError)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try { // попытаемся верифицировать токен
    payload = jwt.verify(token, 'secret-key');
  } catch (error) { // отправим ошибку, если не получилось
    // throw new UnautorizedError('Необходима авторизация');
    return res
      .status(UnautorizedError)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
