const ManagerModel = require('../../models/manager/managerModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/manager');
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

// Get All Managers
const getAllManagers = catchAsyncErrors(async (req, res, next) => {
  try {
    const ownerId = req.user.id; // Assuming the owner's ID is stored in req.user.id
    const managers = await ManagerModel.getAllManagers(ownerId);
    res.status(200).json({ success: true, managers });
  } catch (error) {
    next(new ErrorHandler('Error fetching all Managers', 500));
  }
});

// Create Manager
const createManager = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }
    const { name, email, password, color } = req.body;
    const avatar = req.file ? req.file.path : null;
    try {
      const result = await ManagerModel.createManager({
        name,
        email,
        password,
        avatar,
        color,
        role: 'manager',
        owner_id: req.user.id // Assuming the owner's ID is stored in req.user.id
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error creating Manager:', error);
      next(new ErrorHandler('Error creating Manager', 500));
    }
  });
};

// Get Manager Details
const getManagerDetails = catchAsyncErrors(async (req, res, next) => {
  const managerId = req.manager.id;
  try {
    const result = await ManagerModel.getManagerDetails(managerId);
    if (!result) {
      return next(new ErrorHandler('Manager not found', 404));
    }
    res.status(200).json({ success: true, manager: result });
  } catch (error) {
    console.error('Error fetching Manager details:', error);
    next(new ErrorHandler('Error fetching Manager details', 500));
  }
});

// Update Manager Profile
const updateManagerProfile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }
    const { name, email, password, color } = req.body;
    const newAvatar = req.file ? req.file.path : null;
    try {
      const currentManager = await ManagerModel.getManagerDetails(req.manager.id);
      if (currentManager.avatar && newAvatar) {
        const oldAvatarPath = path.join(__dirname, '..', '..', currentManager.avatar);
        try {
          await fs.unlink(oldAvatarPath);
        } catch (unlinkErr) {
          if (unlinkErr.code !== 'ENOENT') {
            console.error('Error deleting old avatar:', unlinkErr);
            return next(new ErrorHandler('Error deleting old avatar', 500));
          }
        }
      }
      const updatedManager = await ManagerModel.updateManager({
        id: req.manager.id,
        name,
        email,
        password,
        avatar: newAvatar,
        color
      });
      res.status(200).json({ success: true, data: updatedManager });
    } catch (error) {
      console.error('Error updating Manager profile:', error);
      next(new ErrorHandler('Error updating Manager profile', 500));
    }
  });
};

// Delete Manager
const deleteManager = catchAsyncErrors(async (req, res, next) => {
  const managerId = req.params.id;
  try {
    const manager = await ManagerModel.getManagerDetails(managerId);
    if (!manager) {
      return next(new ErrorHandler('Manager not found', 404));
    }
    if (manager.avatar) {
      const avatarPath = path.join(__dirname, '..', '..', manager.avatar);
      try {
        await fs.unlink(avatarPath);
      } catch (unlinkErr) {
        console.error('Error deleting avatar:', unlinkErr);
        return next(new ErrorHandler('Error deleting avatar', 500));
      }
    }
    await ManagerModel.deleteManager(managerId);
    res.status(200).json({ success: true, message: 'Manager deleted successfully' });
  } catch (error) {
    console.error('Error deleting Manager:', error);
    next(new ErrorHandler('Error deleting Manager', 500));
  }
});

// Logout Manager
const logoutManager = (req, res, next) => {
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

// Manager Login
const loginManager = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Please Provide Email & Password', 400));
  }
  const manager = await ManagerModel.getManagerByEmail(email);
  if (!manager) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }
  const isMatch = await ManagerModel.comparePassword(password, manager.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }
  // Send token and response using sendToken
  sendToken(manager, 200, res);
});

module.exports = {
  getAllManagers,
  createManager,
  getManagerDetails,
  updateManagerProfile,
  deleteManager,
  logoutManager,
  loginManager
};
// module.exports = {
//   createManager,
//   getManagerDetails,
//   updateManagerProfile,
//   deleteManager,
//   logoutManager,
//   loginManager,
//   changeManagerToEmployee,
//   updateManagerRole
// };
