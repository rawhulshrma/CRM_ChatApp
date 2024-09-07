const Joi = require('joi');

const validateCurrency = (data, isUpdate = false) => {
    // Define schema for currency validation
    const schema = Joi.object({
        name: Joi.string()
            .max(100)
            .when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.required() })
            .messages({
                'string.max': 'Name should not exceed 100 characters.',
                'any.required': 'Name is required.'
            }),
        code: Joi.string()
            .max(10)
            .when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.required() })
            .messages({
                'string.max': 'Code should not exceed 10 characters.',
                'any.required': 'Code is required.'
            }),
        symbol: Joi.string()
            .max(10)
            .when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.required() })
            .messages({
                'string.max': 'Symbol should not exceed 10 characters.',
                'any.required': 'Symbol is required.'
            }),
        decimal_separator: Joi.string()
            .length(1)
            .required()
            .messages({
                'string.length': 'Decimal separator should be a single character.',
                'any.required': 'Decimal separator is required.'
            }),
        thousand_separator: Joi.string()
            .length(1)
            .required()
            .messages({
                'string.length': 'Thousand separator should be a single character.',
                'any.required': 'Thousand separator is required.'
            }),
        cent_precision: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.integer': 'Cent precision must be an integer.',
                'number.positive': 'Cent precision must be a positive number.',
                'any.required': 'Cent precision is required.'
            }),
        color: Joi.string()
            .max(20)
            .when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.required() })
            .messages({
                'string.max': 'Color should not exceed 20 characters.',
                'any.required': 'Color is required.'
            }),
        exchangeRate: Joi.number()
            .precision(4)
            .positive()
            .optional()
            .messages({
                'number.precision': 'Exchange rate should have at most 4 decimal places.',
                'number.positive': 'Exchange rate must be a positive number.'
            })
    });

    // Validate the data using the schema
    return schema.validate(data, { context: { isUpdate } });
};

module.exports = { validateCurrency };
