const pool = require('../../config/db');

// Create the products table
const createProductsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      product_category VARCHAR(100) NOT NULL,
      description VARCHAR(1000) NOT NULL,
      snapshot VARCHAR(255),
      price NUMERIC NOT NULL,
      ratings NUMERIC CHECK (ratings >= 0 AND ratings <= 5),
      created_at DATE DEFAULT CURRENT_DATE
    );
  `;
  await pool.query(query);
};

// Get all products
const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Get product by ID
const getProductById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Create new product
const createProduct = async (product) => {
  const { name, product_category, description, snapshot, price, ratings } = product;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, product_category, description, snapshot, price, ratings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, product_category, description, snapshot, price, ratings]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update existing product
const updateProduct = async (id, product) => {
  const { name, product_category, description, snapshot, price, ratings } = product;
  try {
    let updateQuery = 'UPDATE products SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (product_category !== undefined) {
      updateQuery += `product_category = $${paramCount}, `;
      updateValues.push(product_category);
      paramCount++;
    }
    if (description !== undefined) {
      updateQuery += `description = $${paramCount}, `;
      updateValues.push(description);
      paramCount++;
    }
    if (snapshot !== undefined) {
      updateQuery += `snapshot = $${paramCount}, `;
      updateValues.push(snapshot);
      paramCount++;
    }
    if (price !== undefined) {
      updateQuery += `price = $${paramCount}, `;
      updateValues.push(price);
      paramCount++;
    }
    if (ratings !== undefined) {
      updateQuery += `ratings = $${paramCount}, `;
      updateValues.push(ratings);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product by ID
const deleteProduct = async (id) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

module.exports = {
  createProductsTable,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
