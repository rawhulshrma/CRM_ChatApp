const TaxModel = require('../../models/settings/taxesModels');
const ErrorHandler = require('../../utils/errorHandler');
const { validateTaxData } = require('../../utils/validateTaxes');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

// Get All Taxes
exports.getAllTaxes = catchAsyncErrors(async (req, res) => {
  const taxes = await TaxModel.getAllTaxes();
  res.status(200).json({
    success: true,
    count: taxes.length, // Add count of records
    data: taxes,
  });
});

// Get Tax by ID
exports.getTaxById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Ensure ID is provided
  if (!id) {
    return next(new ErrorHandler('Tax ID is required', 400));
  }

  // Fetch the tax by ID
  const tax = await TaxModel.getTaxById(id);

  // Handle case where tax is not found
  if (!tax) {
    return next(new ErrorHandler('Tax not found', 404));
  }

  res.status(200).json({
    success: true,
    data: tax,
  });
});

// Add a new tax
exports.createTax = catchAsyncErrors(async (req, res, next) => {
  console.log('Received request to create tax. Body:', req.body);

  // Validate the incoming tax data
  const { error, value } = validateTaxData(req.body);
  if (error) {
    console.log('Validation error:', error.details);
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  console.log('Validation passed. Validated data:', value);

  // Create the new tax entry
  const newTax = await TaxModel.createTax(value);
  console.log('Tax created successfully:', newTax);

  res.status(201).json({
    success: true,
    message: 'Tax created successfully',
    data: newTax,
  });
});

// Update an existing tax
exports.updateTax = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validateTaxData(req.body);

  // Ensure ID is provided
  if (!id) {
    return next(new ErrorHandler('Tax ID is required', 400));
  }

  // Validate the incoming tax data
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  // Update the tax entry
  const updatedTax = await TaxModel.updateTax(id, value);

  // Handle case where tax is not found
  if (!updatedTax) {
    return next(new ErrorHandler('Tax not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Tax updated successfully',
    data: updatedTax,
  });
});

// Delete a tax
exports.deleteTax = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Ensure ID is provided
  if (!id) {
    return next(new ErrorHandler('Tax ID is required', 400));
  }

  // Delete the tax entry
  const deletedTax = await TaxModel.deleteTax(id);

  // Handle case where tax is not found
  if (!deletedTax) {
    return next(new ErrorHandler('Tax not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Tax deleted successfully',
    data: deletedTax,
  });
});
