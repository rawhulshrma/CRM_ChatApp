const Joi = require('joi');

// Define the schema for individual items
const itemSchema = Joi.object({
  description: Joi.string().max(255).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).positive().required(),
  total: Joi.number().precision(2).positive().required()
});

// Define the schema for invoice creation and updating
const invoiceSchema = Joi.object({
    client: Joi.string().max(100).required(),
    number: Joi.number().integer().required(),
    year: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
    currencies: Joi.string().valid('USD', 'EUR', 'INR').required(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'cancelled').required(),
    payment: Joi.string().valid('paid', 'unpaid').required(),  // Added payment validation
    date: Joi.date().iso().required(),
    expire_date: Joi.date().iso().greater(Joi.ref('date')).required(),
    note: Joi.string().allow(''),
    sub_total: Joi.number().precision(2).positive().required(),
    tax_total: Joi.number().precision(2).positive().required(),
    full_total: Joi.number().precision(2).positive().required(),
    items: Joi.array().items(itemSchema).required()
});

// Validate function for creating or updating invoice
const validateInvoice = (invoiceData, isUpdate = false) => {
  const { error } = invoiceSchema.validate(invoiceData, { abortEarly: false });

  if (error) {
    return {
      error: {
        details: error.details.map((detail) => ({
          message: detail.message,
          path: detail.path.join('.'),
        })),
      },
    };
  }

  return { value: invoiceData };
};

module.exports = { validateInvoice };
