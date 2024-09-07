const jwt = require('jsonwebtoken');
const UserModel = require('../models/user/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

const ROLES = {
  OWNER: 'owner',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  MANAGER: 'manager'
};

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.getUserById(decoded.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token has expired', 401));
    }
    return next(new ErrorHandler('Invalid token', 401));
  }
});

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ErrorHandler('User role not found', 403));
    }

    const hasPermission = allowedRoles.some(role => role.toLowerCase() === req.user.role.toLowerCase());

    if (!hasPermission) {
      return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
    }

    next();
  };
};

const identifyUserRole = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return next(new ErrorHandler('User role not found', 403));
  }

  Object.keys(ROLES).forEach(role => {
    req[`is${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`] = req.user.role.toLowerCase() === ROLES[role].toLowerCase();
  });

  next();
};

module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
  identifyUserRole,
  ROLES
};















// const jwt = require('jsonwebtoken');
// const UserModel = require('../models/user/userModel');
// const ErrorHandler = require('../utils/errorHandler');
// const catchAsyncErrors = require('./catchAsyncErrors');

// const ROLES = {
//   OWNER: 'owner',
//   EMPLOYEE: 'employee',
//   ADMIN: 'admin',
//   MANAGER: 'manager'
// };

// const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return next(new ErrorHandler('Please login to access this resource', 401));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await UserModel.getUserById(decoded.id);

//     if (!user) {
//       return next(new ErrorHandler('User not found', 404));
//     }

//     req.user = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       avatar: user.avatar
//     };

//     next();
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     if (error.name === 'TokenExpiredError') {
//       return next(new ErrorHandler('Token has expired', 401));
//     }
//     return next(new ErrorHandler('Invalid token', 401));
//   }
// });

// const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return next(new ErrorHandler('User role not found', 403));
//     }

//     const hasPermission = allowedRoles.some(role => role.toLowerCase() === req.user.role.toLowerCase());

//     if (!hasPermission) {
//       return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
//     }

//     next();
//   };
// };

// const identifyUserRole = (req, res, next) => {
//   if (!req.user || !req.user.role) {
//     return next(new ErrorHandler('User role not found', 403));
//   }

//   Object.keys(ROLES).forEach(role => {
//     req[`is${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`] = req.user.role.toLowerCase() === ROLES[role].toLowerCase();
//   });

//   next();
// };

// module.exports = {
//   isAuthenticatedUser,
//   authorizeRoles,
//   identifyUserRole,
//   ROLES
// };