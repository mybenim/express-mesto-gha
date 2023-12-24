const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

const errorHandler = (error, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR // status code 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};

module.exports = errorHandler;
