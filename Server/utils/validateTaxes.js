const Joi = require('joi');

// Validation schema for tax data
const taxSchema = Joi.object({
  name: Joi.string().min(1).max(100).required()
    .pattern(/^[a-zA-Z0-9\s-]+$/)
    .messages({
      'string.pattern.base': 'Name must contain only alphanumeric characters, spaces, and hyphens',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required',
    }),

  value: Joi.number().min(0).max(100).required()
    .messages({
      'number.base': 'Value must be a number',
      'number.min': 'Value must be at least 0',
      'number.max': 'Value cannot exceed 100',
      'any.required': 'Value is required',
    }),
});

/**
 * Validates tax data
 * @param {Object} taxData - The tax data to validate
 * @returns {Object} - The validation result
 */
const validateTaxData = (taxData) => {
  return taxSchema.validate(taxData, { abortEarly: false });
};

module.exports = {
  validateTaxData,
};