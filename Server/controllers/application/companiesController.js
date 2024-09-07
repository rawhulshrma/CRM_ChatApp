const CompaniesModel = require('../../models/application/companiesModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Get all companies
const getAllCompanies = catchAsyncErrors(async (req, res, next) => {
    const companies = await CompaniesModel.getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies
    });
});

// Get companies by ID
const getCompaniesById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const companies = await CompaniesModel.getCompaniesById(id);
  if (!companies) {
    return next(new ErrorHandler('Companies not found', 404));
  }
  res.status(200).json({
    success: true,
    data: companies
  });
});

// Add new companies
const addCompanies = catchAsyncErrors(async (req, res, next) => {
    const { name, contact, country, phone, email, website } = req.body;
  
    // Check if companies already exists
    const existingCompanies = await CompaniesModel.getCompaniesByEmail(email);
    if (existingCompanies) {
      return next(new ErrorHandler('Companies already exists', 400));
    }
  
    // Create new companies
    const newCompanies = await CompaniesModel.createCompanies({
      name,
      contact,
      country,
      phone,
      email,
      website,
    });
  
    res.status(201).json({
      success: true,
      message: 'Companies created successfully',
      data: newCompanies,
    });
});

// Get details of companies
const getCompaniesDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const companies = await CompaniesModel.getCompaniesById(id);
    if (!companies) {
      return next(new ErrorHandler('Companies not found', 404));
    }
    res.status(200).json({
      success: true,
      data: companies
    });
});

module.exports = {
  getAllCompanies,
  getCompaniesById,
  addCompanies,
  getCompaniesDetails,
};