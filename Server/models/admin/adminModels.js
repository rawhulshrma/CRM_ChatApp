const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const createAdminTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES "user"(id),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar VARCHAR(255),
      color VARCHAR(50) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      owner_id INTEGER REFERENCES owner(id) ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log('Admin table created successfully');
  } catch (error) {
    console.error('Error creating Admin table:', error);
    throw error;
  }
};

const createAdmin = async (adminData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    // Insert into "user" table
    const userQuery = `
      INSERT INTO "user" (name, email, password, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const userResult = await client.query(userQuery, [adminData.name, adminData.email, hashedPassword, adminData.avatar, 'admin']);
    const userId = userResult.rows[0].id;

    // Insert into admin table
    const adminQuery = `
      INSERT INTO admin (user_id, name, email, password, avatar, color, role, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, name, email, avatar, color, role, created_at
    `;
    const adminResult = await client.query(adminQuery, [
      userId,
      adminData.name,
      adminData.email,
      hashedPassword,
      adminData.avatar,
      adminData.color,
      'admin',
      adminData.owner_id
    ]);

    await client.query('COMMIT');
    return adminResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Admin:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getAllAdmins = async (ownerId) => {
  try {
    const query = 'SELECT id, name, email, avatar, color, role, created_at FROM admin WHERE owner_id = $1';
    const result = await pool.query(query, [ownerId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Admins:', error);
    throw error;
  }
};

const getAdminByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM admin WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching Admin by email:', error);
    throw error;
  }
};

const updateAdmin = async (admin) => {
  const { id, name, email, password, avatar, color, role } = admin;
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
      return getAdminDetails(id);
    }

    const updateQuery = `
      UPDATE admin 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, avatar, color, role, created_at
    `;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Admin not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating Admin:', error);
    throw error;
  }
};

const getAdminDetails = async (adminId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, color, role, created_at FROM admin WHERE id = $1',
      [adminId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Admin details:', error);
    throw error;
  }
};

const deleteAdmin = async (adminId) => {
  try {
    const result = await pool.query(
      'DELETE FROM admin WHERE id = $1 RETURNING id',
      [adminId]
    );
    if (result.rows.length === 0) {
      throw new Error('Admin not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting Admin:', error);
    throw error;
  }
};

const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  createAdminTable,
  getAllAdmins,
  getAdminByEmail,
  createAdmin,
  updateAdmin,
  getAdminDetails,
  deleteAdmin,
  comparePassword,
};