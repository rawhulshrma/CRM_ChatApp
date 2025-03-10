const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const { createUser } = require('../user/userModels');

const createManagerTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS manager (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES "user"(id),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar VARCHAR(255),
      color VARCHAR(50) NOT NULL,
      role VARCHAR(50) DEFAULT 'manager',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      owner_id INTEGER REFERENCES owner(id) ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log('Manager table created successfully');
  } catch (error) {
    console.error('Error creating Manager table:', error);
    throw error;
  }
};

const createManager = async (managerData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const hashedPassword = await bcrypt.hash(managerData.password, 10);

    // Insert into "user" table
    const userQuery = `
      INSERT INTO "user" (name, email, password, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const userResult = await client.query(userQuery, [managerData.name, managerData.email, hashedPassword, managerData.avatar, 'manager']);
    const userId = userResult.rows[0].id;

    // Insert into manager table
    const managerQuery = `
      INSERT INTO manager (user_id, name, email, password, avatar, color, role, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, name, email, avatar, color, role, created_at
    `;
    const managerResult = await client.query(managerQuery, [
      userId,
      managerData.name,
      managerData.email,
      hashedPassword,
      managerData.avatar,
      managerData.color,
      'manager',
      managerData.owner_id
    ]);

    await client.query('COMMIT');
    return managerResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Manager:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getAllManagers = async (ownerId) => {
  try {
    const query = 'SELECT id, name, email, avatar, color, role, created_at FROM manager WHERE owner_id = $1';
    const result = await pool.query(query, [ownerId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Managers:', error);
    throw error;
  }
};

const getManagerByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM manager WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching Manager by email:', error);
    throw error;
  }
};

const updateManager = async (manager) => {
  const { id, name, email, password, avatar, color, role } = manager;
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
      return getManagerDetails(id);
    }

    const updateQuery = `
      UPDATE manager
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, avatar, color, role, created_at
    `;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);
    if (result.rows.length === 0) {
      throw new Error('Manager not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error updating Manager:', error);
    throw error;
  }
};

const getManagerDetails = async (managerId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, color, role, created_at FROM manager WHERE id = $1',
      [managerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Manager details:', error);
    throw error;
  }
};

const deleteManager = async (managerId) => {
  try {
    const result = await pool.query(
      'DELETE FROM manager WHERE id = $1 RETURNING id',
      [managerId]
    );
    if (result.rows.length === 0) {
      throw new Error('Manager not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting Manager:', error);
    throw error;
  }
};

const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  createManagerTable,
  getAllManagers,
  getManagerByEmail,
  createManager,
  updateManager,
  getManagerDetails,
  deleteManager,
  comparePassword,
};



// module.exports = {
//   createManagerTable,
//   getManagerByEmail,
//   createManager,
//   updateManager,
//   getManagerDetails,
//   deleteManager,
//   comparePassword,
//   transferManagerToEmployee
// };
