const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const { createUser } = require('../user/userModels');

const createEmployeeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES "user"(id),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar VARCHAR(255),
      color VARCHAR(50) NOT NULL,
      role VARCHAR(50) DEFAULT 'employee',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      owner_id INTEGER REFERENCES owner(id) ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log('Employee table created successfully');
  } catch (error) {
    console.error('Error creating Employee table:', error);
    throw error;
  }
};

const createEmployee = async (employeeData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash(employeeData.password, 10);

    // Insert into "user" table
    const userQuery = `
      INSERT INTO "user" (name, email, password, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const userResult = await client.query(userQuery, [employeeData.name, employeeData.email, hashedPassword, employeeData.avatar, 'employee']);
    const userId = userResult.rows[0].id;

    // Insert into employee table
    const employeeQuery = `
      INSERT INTO employee (user_id, name, email, password, avatar, color, role, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, name, email, avatar, color, role, created_at
    `;
    const employeeResult = await client.query(employeeQuery, [
      userId,
      employeeData.name,
      employeeData.email,
      hashedPassword,
      employeeData.avatar,
      employeeData.color,
      'employee',
      employeeData.owner_id
    ]);

    await client.query('COMMIT');
    return employeeResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Employee:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getAllEmployees = async (ownerId) => {
  try {
    const query = 'SELECT id, name, email, avatar, color, role, created_at FROM employee WHERE owner_id = $1';
    const result = await pool.query(query, [ownerId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Employees:', error);
    throw error;
  }
};

const getEmployeeByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM employee WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching Employee by email:', error);
    throw error;
  }
};

const updateEmployee = async (employee) => {
  const { id, name, email, password, avatar, color, role } = employee;
  try {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
      paramCount++;
    }
    if (email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      updateValues.push(email);
      paramCount++;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${paramCount}`);
      updateValues.push(hashedPassword);
      paramCount++;
    }
    if (avatar !== undefined) {
      updateFields.push(`avatar = $${paramCount}`);
      updateValues.push(avatar);
      paramCount++;
    }
    if (color !== undefined) {
      updateFields.push(`color = $${paramCount}`);
      updateValues.push(color);
      paramCount++;
    }
    if (role !== undefined) {
      updateFields.push(`role = $${paramCount}`);
      updateValues.push(role);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return getEmployeeDetails(id);
    }

    const updateQuery = `
      UPDATE employee
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, avatar, color, role, created_at
    `;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Employee not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating Employee:', error);
    throw error;
  }
};

const getEmployeeDetails = async (employeeId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, color, role, created_at FROM employee WHERE id = $1',
      [employeeId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Employee details:', error);
    throw error;
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const result = await pool.query(
      'DELETE FROM employee WHERE id = $1 RETURNING id',
      [employeeId]
    );
    if (result.rows.length === 0) {
      throw new Error('Employee not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting Employee:', error);
    throw error;
  }
};

const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  createEmployeeTable,
  getAllEmployees,
  getEmployeeByEmail,
  createEmployee,
  updateEmployee,
  getEmployeeDetails,
  deleteEmployee,
  comparePassword,
};

// module.exports = {
//   createEmployeeTable,
//   getEmployeeByEmail,
//   createEmployee,
//   updateEmployee,
//   getEmployeeDetails,
//   deleteEmployee,
//   comparePassword,
//   transferEmployeeToUser
// };