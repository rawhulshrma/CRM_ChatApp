const pool = require('../../config/db'); // Adjust the path if needed

// Create the ProductCategory table
const createProductCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS productcategory (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR(255) NOT NULL,
      color VARCHAR(7) NOT NULL, -- Adjusted to accommodate hex color codes
      owner_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get all product categories
const getAllProductCategory = async () => {
  try {
    const result = await pool.query('SELECT id, name, description, color, owner_id, created_at FROM productcategory');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all product categories:', error);
    throw error;
  }
};

// Get product category by ID
const getProductCategoryById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, description, color, owner_id, created_at FROM productcategory WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching product category with ID ${id}:`, error);
    throw error;
  }
};

// Get product category by name
const getProductCategoryByName = async (name) => {
  try {
    const result = await pool.query('SELECT id, name, description, color, owner_id, created_at FROM productcategory WHERE name = $1', [name]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching product category with name ${name}:`, error);
    throw error;
  }
};

// Create new product category
const createProductCategory = async (productCategory) => {
  const { name, description, color, owner_id } = productCategory;
  try {
    const result = await pool.query(
      'INSERT INTO productcategory (name, description, color, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, description, color, owner_id, created_at',
      [name, description, color, owner_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating product category:', error);
    throw error;
  }
};

// Update existing product category
const updateProductCategory = async (id, productCategory) => {
  const { name, description, color, owner_id } = productCategory;
  try {
    let updateQuery = 'UPDATE productcategory SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      updateQuery += `description = $${paramCount}, `;
      updateValues.push(description);
      paramCount++;
    }
    if (color !== undefined) {
      updateQuery += `color = $${paramCount}, `;
      updateValues.push(color);
      paramCount++;
    }
    if (owner_id !== undefined) {
      updateQuery += `owner_id = $${paramCount}, `;
      updateValues.push(owner_id);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, description, color, owner_id, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Product category not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating product category:', error);
    throw error;
  }
};

// Delete product category by ID
const deleteProductCategory = async (id) => {
  try {
    await pool.query('DELETE FROM productcategory WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting product category:', error);
    throw error;
  }
};

module.exports = {
  createProductCategoryTable,
  getAllProductCategory,
  getProductCategoryById,
  getProductCategoryByName,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
