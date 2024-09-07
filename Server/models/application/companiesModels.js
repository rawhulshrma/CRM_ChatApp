const pool = require('../../config/db'); // Adjust the path as needed

// Create the companies table
const createCompaniesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      contact VARCHAR(100),
      country VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100),
      website VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get all companies
const getAllCompanies = async () => {
  try {
    const result = await pool.query('SELECT id, name, contact, country, phone, email, website, created_at FROM companies');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw error;
  }
};

// Get companies by ID
const getCompaniesById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, contact, country, phone, email, website, created_at FROM companies WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching companies with ID ${id}:`, error);
    throw error;
  }
};

// Get companies by email
const getCompaniesByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT id, name, contact, country, phone, email, website, created_at FROM companies WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching companies with email ${email}:`, error);
    throw error;
  }
};

// Create new companies
const createCompanies = async (companies) => {
  const { name, contact, country, phone, email, website } = companies;
  try {
    const result = await pool.query(
      'INSERT INTO companies (name, contact, country, phone, email, website) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, contact, country, phone, email, website, created_at',
      [name, contact, country, phone, email, website]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating companies:', error);
    throw error;
  }
};

// Update existing companies
const updateCompanies = async (id, companies) => {
  const { name, contact, country, phone, email, website } = companies;
  try {
    let updateQuery = 'UPDATE companies SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (contact !== undefined) {
      updateQuery += `contact = $${paramCount}, `;
      updateValues.push(contact);
      paramCount++;
    }
    if (country !== undefined) {
      updateQuery += `country = $${paramCount}, `;
      updateValues.push(country);
      paramCount++;
    }
    if (phone !== undefined) {
      updateQuery += `phone = $${paramCount}, `;
      updateValues.push(phone);
      paramCount++;
    }
    if (email !== undefined) {
      updateQuery += `email = $${paramCount}, `;
      updateValues.push(email);
      paramCount++;
    }
    if (website !== undefined) {
      updateQuery += `website = $${paramCount}, `;
      updateValues.push(website);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, contact, country, phone, email, website, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Companies not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating companies:', error);
    throw error;
  }
};

// Delete companies by ID
const deleteCompanies = async (id) => {
  try {
    await pool.query('DELETE FROM companies WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting companies:', error);
    throw error;
  }
};

module.exports = {
  createCompaniesTable,
  getAllCompanies,
  getCompaniesById,
  getCompaniesByEmail,
  createCompanies,
  updateCompanies,
  deleteCompanies,
};