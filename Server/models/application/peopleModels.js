const pool = require('../../config/db');

// Create the people table
const createPeopleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS people (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      company VARCHAR(100),
      country VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get all people
const getAllPeople = async () => {
  try {
    const query = 'SELECT id, name, company, country, phone, email, created_at FROM people';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all People:', error);
    throw error;
  }
};

// Get a person by email
const getPersonByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT id, name, company, country, phone, email, created_at FROM people WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching person by email ${email}:`, error);
    throw error;
  }
};

// Get a person by ID
const getPeopleById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, company, country, phone, email, created_at FROM people WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching person with ID ${id}:`, error);
    throw error;
  }
};

// Create a new person
const createPerson = async (person) => {
  const { name, company, country, phone, email } = person;
  try {
    const result = await pool.query(
      'INSERT INTO people (name, company, country, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, company, country, phone, email, created_at',
      [name, company, country, phone, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating person:', error);
    throw error;
  }
};

// Update an existing person
const updatePerson = async (id, person) => {
  const { name, company, country, phone, email } = person;
  try {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      updateValues.push(name);
    }
    if (company !== undefined) {
      updateFields.push(`company = $${paramCount++}`);
      updateValues.push(company);
    }
    if (country !== undefined) {
      updateFields.push(`country = $${paramCount++}`);
      updateValues.push(country);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      updateValues.push(phone);
    }
    if (email !== undefined) {
      updateFields.push(`email = $${paramCount++}`);
      updateValues.push(email);
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const updateQuery = `UPDATE people SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, company, country, phone, email, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Person not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;
  }
};

// Delete a person by ID
const deletePerson = async (id) => {
  try {
    const result = await pool.query('DELETE FROM people WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      throw new Error('Person not found');
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
};

module.exports = {
  createPeopleTable,
  getAllPeople,
  getPeopleById,
  getPersonByEmail,
  createPerson,
  updatePerson,
  deletePerson,
};