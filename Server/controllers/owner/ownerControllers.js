// controllers/owner/ownerControllers.js
const OwnerModel = require('../../models/owner/ownerModels');
const AdminModel = require('../../models/admin/adminModels');
const EmployeeModel = require('../../models/employee/employeeModels');
const ManagerModel = require('../../models/manager/managerModels');
const chatModel = require('../../models/chat/chatModels');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const moment = require('moment');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter
});






const createOwner = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  try {
    const newOwner = await OwnerModel.createOwner({ name, email, password, avatar });
    res.status(201).json({ success: true, data: newOwner });
  } catch (error) {
    next(new ErrorHandler('Error creating owner', 500));
  }
});


// Login Owner
const loginOwner = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  const owner = await OwnerModel.getOwnerByEmail(email);
  if (!owner) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(owner, 200, res);
});

// Get Owner Details
const getOwnerDetails = catchAsyncErrors(async (req, res, next) => {
  const ownerId = req.user.id;
  try {
    const owner = await OwnerModel.getOwnerDetails(ownerId);
    if (!owner) {
      return next(new ErrorHandler('Owner not found', 404));
    }
    res.status(200).json({ success: true, owner });
  } catch (error) {
    next(new ErrorHandler('Error fetching owner details', 500));
  }
});

// Update Owner Profile
const updateOwnerProfile = catchAsyncErrors(async (req, res, next) => {
  upload.single('avatar')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorHandler(err.message, 400));
    } else if (err) {
      return next(new ErrorHandler(err.message, 500));
    }

    const { name, email } = req.body;
    const ownerId = req.user.id;

    // Check if name and email are provided
    if (!name || !email) {
      return next(new ErrorHandler('Name and email are required', 400));
    }

    let updateData = { id: ownerId, name, email };

    if (req.file) {
      updateData.avatar = req.file.path.replace(/\\/g, "/");
    }

    try {
      const updatedOwner = await OwnerModel.updateOwner(updateData);

      // Remove sensitive information
      delete updatedOwner.password;

      res.status(200).json({ success: true, data: updatedOwner });
    } catch (error) {
      console.error('Error updating owner profile:', error);
      next(new ErrorHandler('Error updating owner profile', 500));
    }
  });
});

// Logout Owner
const logoutOwner = (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict' // Protect against CSRF
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};


// Create Admin
const createAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar, branch } = req.body;
  const ownerId = req.owner.id;

  try {
    const newAdmin = await AdminModel.createAdmin({ name, email, password, avatar, branch, owner_id: ownerId });
    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    next(new ErrorHandler('Error creating admin', 500));
  }
});




// Create Employee
const createEmployee = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const ownerId = req.owner.id;

  try {
    const newEmployee = await EmployeeModel.createEmployee({ name, email, password, avatar, owner_id: ownerId });
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    next(new ErrorHandler('Error creating employee', 500));
  }
});



// Create Manager
const createManager = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const ownerId = req.owner.id;

  try {
    const newManager = await ManagerModel.createManager({ name, email, password, avatar, owner_id: ownerId });
    res.status(201).json({ success: true, data: newManager });
  } catch (error) {
    next(new ErrorHandler('Error creating manager', 500));
  }
});




   

module.exports = {
  loginOwner,
  getOwnerDetails,
  updateOwnerProfile,
  createOwner,
  createAdmin,
  createEmployee,
  createManager,
  logoutOwner
};

