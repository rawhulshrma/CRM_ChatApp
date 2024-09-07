const CustomerModel = require('../../models/application/customerModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Get all customers
const getAllCustomers = catchAsyncErrors(async (req, res, next) => {
    const customers = await CustomerModel.getAllCustomers();
    res.status(200).json({
      success: true,
      data: customers
    });
});

// Get a customer by ID
const getCustomerById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const customer = await CustomerModel.getCustomerById(id);
  if (!customer) {
    return next(new ErrorHandler('Customer not found', 404));
  }
  res.status(200).json(customer);
});

// Add a new customer
const addCustomer = catchAsyncErrors(async (req, res, next) => {
    const { name, country, contact, phone, email, website } = req.body;
  
    // Check if customer already exists
    const existingCustomer = await CustomerModel.getCustomerByEmail(email);
    if (existingCustomer) {
      return next(new ErrorHandler('Customer already exists', 400));
    }
  
    // Create new customer
    const newCustomer = await CustomerModel.createCustomer({
      name,
      country,
      contact,
      phone,
      email,
      website,
    });
  
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  });
  
// Get details of a customer
const getCustomerDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // ID will be fetched from the URL parameter
    console.log('Fetching details for ID:', id); // Debugging line
    const customer = await CustomerModel.getCustomerById(id);
    if (!customer) {
      return next(new ErrorHandler('Customer not found', 404));
    }
    res.status(200).json({
      success: true,
      data: customer
    });
});

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  getCustomerDetails,
};
