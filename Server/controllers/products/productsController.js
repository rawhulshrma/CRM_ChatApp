const path = require('path');
const multer = require('multer');
const ProductsModel = require('../../models/products/productsModel');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products'); // Directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, 'product-' + Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('snapshot'); // Field name in form

// Add new product with snapshot upload
const addProduct = catchAsyncErrors(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { name, product_category, description, price, ratings } = req.body;
    const snapshot = req.file ? req.file.filename : null; // Handle file upload

    try {
      const newProduct = await ProductsModel.createProduct({
        name,
        product_category,
        description,
        snapshot,
        price,
        ratings
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      next(new ErrorHandler('Error creating product', 500));
    }
  });
});

// Get all products
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await ProductsModel.getAllProducts();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(new ErrorHandler('Error fetching products', 500));
  }
});

// Get product details by ID
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductsModel.getProductById(id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(new ErrorHandler('Error fetching product details', 500));
  }
});

// Update product with optional snapshot upload
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { id } = req.params;
    const { name, product_category, description, price, ratings } = req.body;
    const snapshot = req.file ? req.file.filename : null; // Handle file upload

    try {
      const updatedProduct = await ProductsModel.updateProduct(id, {
        name,
        product_category,
        description,
        snapshot,
        price,
        ratings
      });

      if (!updatedProduct) {
        return next(new ErrorHandler('Product not found', 404));
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      next(new ErrorHandler('Error updating product', 500));
    }
  });
});

// Delete product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await ProductsModel.deleteProduct(id);
    if (!result) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(new ErrorHandler('Error deleting product', 500));
  }
});

// Create product review
const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { review, rating } = req.body;
  try {
    const reviewData = await ProductsModel.createProductReview(id, review, rating);
    if (!reviewData) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: reviewData
    });
  } catch (error) {
    next(new ErrorHandler('Error adding review', 500));
  }
});

// Get product reviews
const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const reviews = await ProductsModel.getProductReviews(id);
    if (!reviews) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(new ErrorHandler('Error fetching reviews', 500));
  }
});

// Delete review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    const result = await ProductsModel.deleteReview(id, reviewId);
    if (!result) {
      return next(new ErrorHandler('Review not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(new ErrorHandler('Error deleting review', 500));
  }
});

module.exports = {
  addProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
};
