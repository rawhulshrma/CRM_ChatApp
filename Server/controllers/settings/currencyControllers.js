const CurrencyModel = require('../../models/settings/currencyModels.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const { validateCurrency } = require('../../utils/validateCurrency');

// Get all currency
const getAllCurrency = catchAsyncErrors(async (req, res, next) => {
  const currency = await CurrencyModel.getAllCurrency();
  if (!currency || currency.length === 0) {
    return next(new ErrorHandler('No currency found', 404));
  }
  res.status(200).json({
    success: true,
    count: currency.length,
    data: currency,
  });
});

// Get currency by ID
const getCurrencyById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Invalid currency ID', 400));
  }

  const currency = await CurrencyModel.getCurrencyById(parsedId);
  if (!currency) {
    return next(new ErrorHandler(`Currency not found with ID: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: currency,
  });
});

// Add a new currency
const addCurrency = catchAsyncErrors(async (req, res, next) => {
  const { error } = validateCurrency(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const newCurrency = await CurrencyModel.addCurrency (req.body, req.user.id);
  if (!newCurrency) {
    return next(new ErrorHandler('Failed to create currency', 500));
  }

  res.status(201).json({
    success: true,
    message: 'Currency created successfully',
    data: newCurrency,
  });
});

// Update existing currency
const updateCurrency = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Invalid currency ID', 400));
  }

  const { error } = validateCurrency(req.body, true);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const updatedCurrency = await CurrencyModel.updateCurrency(parsedId, req.body, req.user.id);
  if (!updatedCurrency) {
    return next(new ErrorHandler(`Failed to update currency with ID: ${id}`, 500));
  }

  res.status(200).json({
    success: true,
    message: 'Currency updated successfully',
    data: updatedCurrency,
  });
});

// Delete a currency
const deleteCurrency = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Invalid currency ID', 400));
  }

  const currency = await CurrencyModel.getCurrencyById(parsedId);
  if (!currency) {
    return next(new ErrorHandler(`Currency not found with ID: ${id}`, 404));
  }

  const result = await CurrencyModel.deleteCurrency(parsedId);
  if (!result) {
    return next(new ErrorHandler('Failed to delete currency', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Currency deleted successfully',
  });
});

module.exports = {
  getAllCurrency: getAllCurrency,
  getCurrencyById: getCurrencyById,
  addCurrency  :   addCurrency,
  updateCurrency: updateCurrency,
  deleteCurrency: deleteCurrency,
};
