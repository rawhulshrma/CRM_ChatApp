// middlewares/error.js

const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong Postgres Supabase ID error
  if (err.code === '22P02') {
    err.statusCode = 400;
    err.message = 'Invalid Supabase ID';
  }

  // Postgres Supabase duplicate key error
  if (err.code === '23505') {
    err.statusCode = 400;
    err.message = 'Duplicate field value entered';
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid Token, please login again';
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Your session has expired, please login again';
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
