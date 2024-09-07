const PeopleModel = require('../../models/application/peopleModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Get All People
const getAllPeople = catchAsyncErrors(async (req, res, next) => {
  try {
    const people = await PeopleModel.getAllPeople();
    res.status(200).json({ success: true, people });
  } catch (error) {
    next(new ErrorHandler('Error fetching all People', 500));
  }
});

// Get a person by ID
const getPeopleById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await PeopleModel.getPeopleById(id);
    if (!person) {
      return next(new ErrorHandler('Person not found', 404));
    }
    res.status(200).json({ success: true, person });
  } catch (error) {
    next(new ErrorHandler('Error fetching person', 500));
  }
});

// Add a new person
const addPeople = catchAsyncErrors(async (req, res, next) => {
  const { name, company, country, phone, email, password } = req.body;

  try {
    // Check if person already exists
    const existingPerson = await PeopleModel.getPersonByEmail(email);
    if (existingPerson) {
      return next(new ErrorHandler('Person already exists', 400));
    }

    // Create new person
    const newPerson = await PeopleModel.createPerson({
      name,
      company,
      country,
      phone,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Person created successfully',
      person: newPerson,
    });
  } catch (error) {
    next(new ErrorHandler('Error creating person', 500));
  }
});

// Update a person
const updatePeople = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, company, country, phone, email } = req.body;
  try {
    const updatedPerson = await PeopleModel.updatePerson(id, { name, company, country, phone, email });
    res.status(200).json({
      success: true,
      message: 'Person updated successfully',
      person: updatedPerson
    });
  } catch (error) {
    next(new ErrorHandler('Error updating person', 500));
  }
});

// Delete a person
const deletePeople = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    await PeopleModel.deletePerson(id);
    res.status(200).json({
      success: true,
      message: 'Person deleted successfully'
    });
  } catch (error) {
    next(new ErrorHandler('Error deleting person', 500));
  }
});

module.exports = {
  getAllPeople,
  getPeopleById,
  addPeople,
  updatePeople,
  deletePeople
};