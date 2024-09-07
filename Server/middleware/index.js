const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const setup = (app) => {
  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  // CORS
  app.use(cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Parse JSON bodies
  app.use(express.json({ limit: '1mb' }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Cookie parser
  app.use(cookieParser());

  // Serve static files
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Set security headers
  app.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
};

module.exports = { setup };