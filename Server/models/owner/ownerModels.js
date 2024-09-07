const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser } = require('../user/userModels');

const createOwnerTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS owner (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES "user"(id),
      users_id INTEGER REFERENCES users(id),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar VARCHAR(255),
      role VARCHAR(50) DEFAULT 'owner',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('Owner table created successfully');
  } catch (error) {
    console.error('Error creating Owner table:', error);
    throw error;
  }
};

const createOwner = async (ownerData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash(ownerData.password, 10);
    
    // Insert into "user" table
    const userQuery = `
      INSERT INTO "user" (name, email, password, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const userResult = await client.query(userQuery, [ownerData.name, ownerData.email, hashedPassword, ownerData.avatar, 'owner']);
    const userId = userResult.rows[0].id;

    // Insert into users table
    const usersId = await createUser('owner');

    // Insert into owner table
    const ownerQuery = `
      INSERT INTO owner (user_id, users_id, name, email, password, avatar, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, users_id, name, email, avatar, role, created_at
    `;
    const ownerResult = await client.query(ownerQuery, [userId, usersId, ownerData.name, ownerData.email, hashedPassword, ownerData.avatar, 'owner']);

    await client.query('COMMIT');
    return ownerResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};



const getOwner = async () => {
  try {
    const result = await pool.query('SELECT * FROM owner LIMIT 1');
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Owner:', error);
    throw error;
  }
};


const getOwnerByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM owner WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching Owner by email:', error);
    throw error;
  }
};

const getOwnerDetails = async (ownerId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, role, to_char(created_at, \'DD-MM-YYYY\') as created_at FROM owner WHERE id = $1',
      [ownerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Owner details:', error);
    throw error;
  }
};


const updateOwner = async (owner) => {
  const { id, name, email, avatar } = owner;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update owner table
    const ownerUpdateQuery = `
      UPDATE owner 
      SET name = $1, email = $2${avatar ? ', avatar = $3' : ''}
      WHERE id = $${avatar ? '4' : '3'}
      RETURNING id, name, email, avatar, role, created_at
    `;
    const ownerUpdateValues = avatar ? [name, email, avatar, id] : [name, email, id];
    const ownerResult = await client.query(ownerUpdateQuery, ownerUpdateValues);

    if (ownerResult.rows.length === 0) {
      throw new Error('Owner not found');
    }

    // Update the user table
    const userUpdateQuery = 'UPDATE "user" SET name = $1, email = $2 WHERE id = $3';
    await client.query(userUpdateQuery, [name, email, id]);

    await client.query('COMMIT');
    return ownerResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating Owner:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getJWTToken = (owner) => {
  const { id, name, email, role } = owner;
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};


const createInitialOwner = async (ownerData) => {
  const hashedPassword = await bcrypt.hash(ownerData.password, 10);
  const query = `
    INSERT INTO owner (name, email, password, avatar, role, created_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    RETURNING id, name, email, avatar, role, to_char(created_at, 'DD-MM-YYYY') as created_at
  `;
  try {
    const result = await pool.query(query, [ownerData.name, ownerData.email, hashedPassword, ownerData.avatar, ownerData.role || 'owner']);
    console.log('Initial owner created successfully');
    return result.rows[0];
  } catch (error) {
    console.error('Error creating Initial Owner:', error);
    throw error;
  }
};

module.exports = {
  createOwnerTable,
  createOwner,
  getOwner,
  getOwnerByEmail,
  getOwnerDetails,
  updateOwner,
  getJWTToken,
  comparePassword,
  createInitialOwner
};
