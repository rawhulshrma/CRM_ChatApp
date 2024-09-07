const pool = require('../../config/db'); // Adjust the path as needed

// Create the customers table
const createCustomersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      country VARCHAR(50) NOT NULL,
      contact VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE,
      website VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get a customer by email
const getCustomerByEmail = async (email) => {
    try {
      const result = await pool.query('SELECT id, name, country, contact, phone, email, website, created_at FROM customers WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching customer by email ${email}:`, error);
      throw error;
    }
  };

// Get all customers
const getAllCustomers = async () => {
    const query = 'SELECT * FROM customers';
    const { rows } = await pool.query(query);
    return rows;
};

// Get a customer by ID
const getCustomerById = async (id) => {
    try {
      const result = await pool.query('SELECT id, name, country, contact, phone, email, website, created_at FROM customers WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  };

// Create a new customer
const createCustomer = async (customer) => {
    const { name, country, contact, phone, email, website } = customer;
    try {
      const result = await pool.query(
        'INSERT INTO customers (name, country, contact, phone, email, website) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, country, contact, phone, email, website, created_at',
        [name, country, contact, phone, email, website]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

// Update an existing customer
const updateCustomer = async (id, customer) => {
  const { name, country, contact, phone, email, website } = customer;
  try {
    let updateQuery = 'UPDATE customers SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (country !== undefined) {
      updateQuery += `country = $${paramCount}, `;
      updateValues.push(country);
      paramCount++;
    }
    if (contact !== undefined) {
      updateQuery += `contact = $${paramCount}, `;
      updateValues.push(contact);
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

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, country, contact, phone, email, website, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Customer not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete a customer by ID
const deleteCustomer = async (id) => {
  try {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

module.exports = {
  createCustomersTable,
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
