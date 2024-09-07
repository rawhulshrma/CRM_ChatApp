const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const InvoiceModel = require('../../models/invoice/invoiceModels');
const { validateInvoice } = require('../../utils/validateInvoice');
const ErrorHandler = require('../../utils/errorHandler');


const getAllInvoices = catchAsyncErrors(async (req, res, next) => {
  const invoices = await InvoiceModel.getAllInvoices(req.user.id);
  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});

const getInvoiceById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Valid invoice ID is required', 400));
  }

  const invoice = await InvoiceModel.getInvoice(parsedId);
  if (!invoice) {
    return next(new ErrorHandler('Invoice not found', 404));
  }

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

const addInvoice = catchAsyncErrors(async (req, res, next) => {
  const { error } = validateInvoice(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const newInvoice = await InvoiceModel.createInvoice(req.body);
  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: newInvoice,
  });
});

const updateInvoice = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Valid invoice ID is required', 400));
  }

  const { error } = validateInvoice(req.body, true);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const updatedInvoice = await InvoiceModel.updateInvoice(parsedId, req.body);
  if (!updatedInvoice) {
    return next(new ErrorHandler('Invoice not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Invoice updated successfully',
    data: updatedInvoice,
  });
});

const deleteInvoice = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return next(new ErrorHandler('Valid invoice ID is required', 400));
  }

  const deletedInvoice = await InvoiceModel.deleteInvoice(parsedId);
  if (!deletedInvoice) {
    return next(new ErrorHandler('Invoice not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Invoice deleted successfully',
  });
});

module.exports = {
  getAllInvoices,
  getInvoiceById,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};
