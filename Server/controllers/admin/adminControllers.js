const AdminModel = require('../../models/admin/adminModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/admin');
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

// Get All Admins
const getAllAdmins = catchAsyncErrors(async (req, res, next) => {
  try {
    const ownerId = req.user.id; // Assuming the owner's ID is stored in req.user.id
    const admins = await AdminModel.getAllAdmins(ownerId);
    res.status(200).json({ success: true, admins });
  } catch (error) {
    next(new ErrorHandler('Error fetching all Admins', 500));
  }
});

// Create Admin
const createAdmin = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const { name, email, password, color } = req.body;
    const avatar = req.file ? req.file.path : null;

    try {
      const result = await AdminModel.createAdmin({
        name,
        email,
        password,
        avatar,
        color,
        role: 'admin',
        owner_id: req.user.id // Assuming the owner's ID is stored in req.user.id
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error creating Admin:', error);
      next(new ErrorHandler('Error creating Admin', 500));
    }
  });
};

// Get Admin Details
const getAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const adminId = req.admin.id;
  try {
    const result = await AdminModel.getAdminDetails(adminId);

    if (!result) {
      return next(new ErrorHandler('Admin not found', 404));
    }

    res.status(200).json({ success: true, admin: result });
  } catch (error) {
    console.error('Error fetching Admin details:', error);
    next(new ErrorHandler('Error fetching Admin details', 500));
  }
});

// Update Admin Profile
const updateAdminProfile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const { name, email, password, color } = req.body;
    const newAvatar = req.file ? req.file.path : null;

    try {
      const currentAdmin = await AdminModel.getAdminDetails(req.admin.id);

      if (currentAdmin.avatar && newAvatar) {
        const oldAvatarPath = path.join(__dirname, '..', '..', currentAdmin.avatar);

        try {
          await fs.unlink(oldAvatarPath);
        } catch (unlinkErr) {
          if (unlinkErr.code !== 'ENOENT') {
            console.error('Error deleting old avatar:', unlinkErr);
            return next(new ErrorHandler('Error deleting old avatar', 500));
          }
        }
      }

      const updatedAdmin = await AdminModel.updateAdmin({
        id: req.admin.id,
        name,
        email,
        password,
        avatar: newAvatar,
        color
      });

      res.status(200).json({ success: true, data: updatedAdmin });
    } catch (error) {
      console.error('Error updating Admin profile:', error);
      next(new ErrorHandler('Error updating Admin profile', 500));
    }
  });
};

// Delete Admin
const deleteAdmin = catchAsyncErrors(async (req, res, next) => {
  const adminId = req.params.id;

  try {
    const admin = await AdminModel.getAdminDetails(adminId);

    if (!admin) {
      return next(new ErrorHandler('Admin not found', 404));
    }

    if (admin.avatar) {
      const avatarPath = path.join(__dirname, '..', '..', admin.avatar);

      try {
        await fs.unlink(avatarPath);
      } catch (unlinkErr) {
        console.error('Error deleting avatar:', unlinkErr);
        return next(new ErrorHandler('Error deleting avatar', 500));
      }
    }

    await AdminModel.deleteAdmin(adminId);

    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting Admin:', error);
    next(new ErrorHandler('Error deleting Admin', 500));
  }
});

// Logout Admin
const logoutAdmin = (req, res, next) => {
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

// Admin Login
const loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Provide Email & Password', 400));
  }

  const admin = await AdminModel.getAdminByEmail(email);
  if (!admin) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  const isMatch = await AdminModel.comparePassword(password, admin.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  // Send token and response using sendToken
  sendToken(admin, 200, res);
});

module.exports = {
  getAllAdmins,
  createAdmin,
  getAdminDetails,
  updateAdminProfile,
  deleteAdmin,
  logoutAdmin,
  loginAdmin
};