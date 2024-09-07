const pool = require('../../config/db');
const ErrorHandler = require('../../utils/errorHandler');

// Create Currency Table
const createCurrencyTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS currency (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(10) NOT NULL UNIQUE,
      symbol VARCHAR(10) NOT NULL,
      decimal_separator CHAR(1) NOT NULL,
      thousand_separator CHAR(1) NOT NULL,
      cent_precision INTEGER NOT NULL CHECK (cent_precision >= 0 AND cent_precision <= 4),
      color VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get All Currencies
const getAllCurrency = async () => {
  try {
    const result = await pool.query('SELECT * FROM currency ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    throw new ErrorHandler('Error fetching all currency', 500);
  }
};

// Get Currency By ID
const getCurrencyById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM currency WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new ErrorHandler('Currency not found', 404);
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(`Error fetching currency with ID ${id}`, 500);
  }
};

// Create Currency
const addCurrency = async (currency) => {
  const { name, code, symbol, decimal_separator, thousand_separator, cent_precision, color } = currency;

  try {
    const result = await pool.query(
      'INSERT INTO currency (name, code, symbol, decimal_separator, thousand_separator, cent_precision, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, code, symbol, decimal_separator, thousand_separator, cent_precision, color]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new ErrorHandler('Currency with this name or code already exists', 409);
    }
    throw new ErrorHandler('Error creating currency', 500);
  }
};

// Update Currency
const updateCurrency = async (id, currency) => {
  const { name, code, symbol, decimal_separator, thousand_separator, cent_precision, color } = currency;

  try {
    const updateQuery = `
      UPDATE currency 
      SET name = COALESCE($1, name), 
          code = COALESCE($2, code), 
          symbol = COALESCE($3, symbol), 
          decimal_separator = COALESCE($4, decimal_separator), 
          thousand_separator = COALESCE($5, thousand_separator), 
          cent_precision = COALESCE($6, cent_precision), 
          color = COALESCE($7, color),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [name, code, symbol, decimal_separator, thousand_separator, cent_precision, color, id]);

    if (result.rows.length === 0) {
      throw new ErrorHandler('Currency not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    if (error.code === '23505') { // Unique constraint violation
      throw new ErrorHandler('Currency with this name or code already exists', 409);
    }
    throw new ErrorHandler('Error updating currency', 500);
  }
};

// Delete Currency
const deleteCurrency = async (id) => {
  try {
    const result = await pool.query('DELETE FROM currency WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new ErrorHandler('Currency not found', 404);
    }
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler('Error deleting currency', 500);
  }
};

module.exports = {
  createCurrencyTable,
  getAllCurrency,
  getCurrencyById,
  addCurrency,
  updateCurrency,
  deleteCurrency,
};
