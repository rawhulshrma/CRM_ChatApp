const { validationResult, check } = require('express-validator');

// Middleware to validate currency ID
const validateCurrencyId = [
  check('id')
    .trim() // Remove any leading/trailing whitespace
    .isInt({ min: 1 }) // Check if the ID is an integer greater than 0
    .withMessage('Valid currency ID is required')
    .toInt(), // Convert the ID to an integer
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateCurrencyId
};
