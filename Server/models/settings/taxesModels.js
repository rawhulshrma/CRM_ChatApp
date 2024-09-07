// models/taxesModel.js

const pool = require('../../config/db');
const ErrorHandler = require('../../utils/errorHandler');

// Create Taxes Table
const createTaxesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS taxes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      value NUMERIC(5,2) NOT NULL CHECK (value >= 0 AND value <= 100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get All Taxes
const getAllTaxes = async () => {
  try {
    const result = await pool.query('SELECT * FROM taxes ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    throw new ErrorHandler('Error fetching all taxes', 500);
  }
};

// Get Tax by ID
const getTaxById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM taxes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new ErrorHandler('Tax not found', 404);
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(`Error fetching tax with ID ${id}`, 500);
  }
};

// Create New Tax
const createTax = async (taxData) => {
  const { name, value } = taxData;

  try {
    const result = await pool.query(
      'INSERT INTO taxes (name, value) VALUES ($1, $2) RETURNING *',
      [name, value]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new ErrorHandler('Tax with this name already exists', 409);
    }
    throw new ErrorHandler('Error creating tax', 500);
  }
};

// Update Existing Tax
const updateTax = async (id, taxData) => {
  const { name, value } = taxData;

  try {
    const result = await pool.query(
      `
      UPDATE taxes 
      SET 
        name = COALESCE($1, name), 
        value = COALESCE($2, value),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING *
      `,
      [name, value, id]
    );

    if (result.rows.length === 0) {
      throw new ErrorHandler('Tax not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new ErrorHandler('Tax with this name already exists', 409);
    }
    throw new ErrorHandler('Error updating tax', 500);
  }
};

// Delete Tax
const deleteTax = async (id) => {
  try {
    const result = await pool.query('DELETE FROM taxes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new ErrorHandler('Tax not found', 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorHandler('Error deleting tax', 500);
  }
};

module.exports = {
  createTaxesTable,
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  deleteTax,
};
