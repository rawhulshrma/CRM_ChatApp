// models/user/userModels.js
const pool = require('../../config/db');

const createUserTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "user" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      avatar VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_type VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    await pool.query(createUsersTableQuery);
    console.log('User and Users tables created successfully');
  } catch (error) {
    console.error('Error creating user tables:', error);
    throw error;
  }
};

const createUser = async (userType) => {
  const query = 'INSERT INTO users (user_type) VALUES ($1) RETURNING id';
  const result = await pool.query(query, [userType]);
  return result.rows[0].id;
};

module.exports = {
  createUserTable,
  createUser
};
