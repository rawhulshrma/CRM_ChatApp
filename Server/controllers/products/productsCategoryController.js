const ProductCategoryModel = require('../../models/products/productCategoryModel');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Get all product categories
const getAllProductCategory = catchAsyncErrors(async (req, res, next) => {
    const productCategories = await ProductCategoryModel.getAllProductCategory();

    if (!productCategories || productCategories.length === 0) {
        return next(new ErrorHandler('No product categories found', 404));
    }

    res.status(200).json({
        success: true,
        data: productCategories
    });
});

// Get product category by ID
const getProductCategoryById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // Convert to integer

    if (isNaN(parsedId)) {
        return next(new ErrorHandler('Valid product category ID is required', 400));
    }

    const productCategory = await ProductCategoryModel.getProductCategoryById(parsedId);
    
    if (!productCategory) {
        return next(new ErrorHandler('Product category not found', 404));
    }

    res.status(200).json({
        success: true,
        data: productCategory
    });
});

// Add new product category
const addProductCategory = catchAsyncErrors(async (req, res, next) => {
    const { name, description, color, owner_id } = req.body;

    // Validate required fields
    if (!name || !description || !color || !owner_id || isNaN(owner_id)) {
        return next(new ErrorHandler('All fields are required and must be valid', 400));
    }

    // Check if the category name already exists
    const existingCategory = await ProductCategoryModel.getProductCategoryByName(name);
    if (existingCategory) {
        return next(new ErrorHandler('Product category with this name already exists', 409));
    }

    // Create new product category
    const newProductCategory = await ProductCategoryModel.createProductCategory({
        name,
        description,
        color,
        owner_id,
    });

    res.status(201).json({
        success: true,
        message: 'Product category created successfully',
        data: newProductCategory,
    });
});

// Update product category
const updateProductCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // Convert to integer
    const { name, description, color, owner_id } = req.body;

    if (isNaN(parsedId)) {
        return next(new ErrorHandler('Valid product category ID is required', 400));
    }

    // Create an update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (owner_id !== undefined) updateData.owner_id = owner_id;

    // Update the product category
    const updatedProductCategory = await ProductCategoryModel.updateProductCategory(parsedId, updateData);

    if (!updatedProductCategory) {
        return next(new ErrorHandler('Product category not found or no changes made', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Product category updated successfully',
        data: updatedProductCategory,
    });
});

// Delete product category by ID
const deleteProductCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // Convert to integer

    if (isNaN(parsedId)) {
        return next(new ErrorHandler('Valid product category ID is required', 400));
    }

    const productCategory = await ProductCategoryModel.getProductCategoryById(parsedId);
    if (!productCategory) {
        return next(new ErrorHandler('Product category not found', 404));
    }

    await ProductCategoryModel.deleteProductCategory(parsedId);

    res.status(200).json({
        success: true,
        message: 'Product category deleted successfully'
    });
});

module.exports = {
    getAllProductCategory,
    getProductCategoryById,
    addProductCategory,
    updateProductCategory,
    deleteProductCategory,
};
