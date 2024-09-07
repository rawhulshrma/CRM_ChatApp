const EmployeeModel = require('../../models/employee/employeeModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/employee');
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
}).single('avatar');

// Get All Employees
const getAllEmployees = catchAsyncErrors(async (req, res, next) => {
  try {
    const ownerId = req.user.id; // Assuming the owner's ID is stored in req.user.id
    const employees = await EmployeeModel.getAllEmployees(ownerId);
    res.status(200).json({ success: true, employees });
  } catch (error) {
    next(new ErrorHandler('Error fetching all Employees', 500));
  }
});

// Create Employee
const createEmployee = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const { name, email, password, color } = req.body;
    const avatar = req.file ? req.file.path : null;

    try {
      const result = await EmployeeModel.createEmployee({
        name,
        email,
        password,
        avatar,
        color,
        role: 'employee',
        owner_id: req.user.id // Assuming the owner's ID is stored in req.user.id
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error creating Employee:', error);
      next(new ErrorHandler('Error creating Employee', 500));
    }
  });
};

// Get Employee Details
const getEmployeeDetails = catchAsyncErrors(async (req, res, next) => {
  const employeeId = req.employee.id;
  try {
    const result = await EmployeeModel.getEmployeeDetails(employeeId);

    if (!result) {
      return next(new ErrorHandler('Employee not found', 404));
    }

    res.status(200).json({ success: true, employee: result });
  } catch (error) {
    console.error('Error fetching Employee details:', error);
    next(new ErrorHandler('Error fetching Employee details', 500));
  }
});

// Update Employee Profile
const updateEmployeeProfile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const { name, email, password, color } = req.body;
    const newAvatar = req.file ? req.file.path : null;

    try {
      const currentEmployee = await EmployeeModel.getEmployeeDetails(req.employee.id);

      if (currentEmployee.avatar && newAvatar) {
        const oldAvatarPath = path.join(__dirname, '..', '..', currentEmployee.avatar);

        try {
          await fs.unlink(oldAvatarPath);
        } catch (unlinkErr) {
          if (unlinkErr.code !== 'ENOENT') {
            console.error('Error deleting old avatar:', unlinkErr);
            return next(new ErrorHandler('Error deleting old avatar', 500));
          }
        }
      }

      const updatedEmployee = await EmployeeModel.updateEmployee({
        id: req.employee.id,
        name,
        email,
        password,
        avatar: newAvatar,
        color
      });

      res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
      console.error('Error updating Employee profile:', error);
      next(new ErrorHandler('Error updating Employee profile', 500));
    }
  });
};

// Delete Employee
const deleteEmployee = catchAsyncErrors(async (req, res, next) => {
  const employeeId = req.params.id;

  try {
    const employee = await EmployeeModel.getEmployeeDetails(employeeId);

    if (!employee) {
      return next(new ErrorHandler('Employee not found', 404));
    }

    if (employee.avatar) {
      const avatarPath = path.join(__dirname, '..', '..', employee.avatar);

      try {
        await fs.unlink(avatarPath);
      } catch (unlinkErr) {
        console.error('Error deleting avatar:', unlinkErr);
        return next(new ErrorHandler('Error deleting avatar', 500));
      }
    }

    await EmployeeModel.deleteEmployee(employeeId);

    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting Employee:', error);
    next(new ErrorHandler('Error deleting Employee', 500));
  }
});

// Logout Employee
const logoutEmployee = (req, res, next) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    next(new ErrorHandler('Error logging out', 500));
  }
};

// Employee Login
const loginEmployee = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Provide Email & Password', 400));
  }

  const employee = await EmployeeModel.getEmployeeByEmail(email);
  if (!employee) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  const isMatch = await EmployeeModel.comparePassword(password, employee.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  // Send token and response using sendToken
  sendToken(employee, 200, res);
});

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployeeDetails,
  updateEmployeeProfile,
  deleteEmployee,
  logoutEmployee,
  loginEmployee
};

// module.exports = {
//   getAllEmployee,
//   createEmployee,
//   getEmployeeDetails,
//   updateEmployeeProfile,
//   deleteEmployee,
//   logoutEmployee,
//   loginEmployee,
//   changeEmployeeToUser,
//   updateEmployeeRole
// };
