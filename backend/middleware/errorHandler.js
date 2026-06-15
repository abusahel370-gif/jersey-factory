const notFound = (req, res) => {
  res.status(404);
  throw new Error("Route Not Found");
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  notFound,
  errorHandler,
};