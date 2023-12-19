const ServerError = (message) => {
  const error = new Error(message);
  error.statusCode = 500;
  return error;
};

module.exports = ServerError;
