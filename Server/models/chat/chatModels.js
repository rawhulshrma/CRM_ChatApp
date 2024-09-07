const pool = require('../../config/db');

const createUserChatTable = async (userName) => {
  const tableName = `chat.${userName.toLowerCase().replace(/\s+/g, '_')}`;
  const query = `
    CREATE SCHEMA IF NOT EXISTS chat;
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL,
      sender_name VARCHAR(100) NOT NULL,
      sender_role VARCHAR(50) NOT NULL,
      receiver_id INTEGER NOT NULL,
      receiver_name VARCHAR(100) NOT NULL,
      receiver_role VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log(`Chat table ${tableName} created successfully`);
  } catch (error) {
    console.error(`Error creating chat table ${tableName}:`, error);
    throw error;
  }
};

const sendMessage = async (senderName, senderId, senderRole, receiverName, receiverId, receiverRole, message) => {
  const tableName = `chat.${senderName.toLowerCase().replace(/\s+/g, '_')}`;

  // Ensure the table exists
  await createUserChatTable(senderName);

  console.log('Sending message with:', {
    senderName, senderId, senderRole, 
    receiverName, receiverId, receiverRole, 
    message
  });

  const query = `
    INSERT INTO ${tableName} (sender_id, sender_name, sender_role, receiver_id, receiver_name, receiver_role, message)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [senderId, senderName, senderRole, receiverId, receiverName, receiverRole, message]);
    return result.rows[0];
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const getMessages = async (userName, otherUserId) => {
  const tableName = `chat.${userName.toLowerCase().replace(/\s+/g, '_')}`;
  
  // Ensure the table exists
  await createUserChatTable(userName);

  console.log('Fetching messages for:', {
    tableName, otherUserId
  });

  const query = `
    SELECT * FROM ${tableName}
    WHERE (sender_id = $1 OR receiver_id = $1)
    ORDER BY timestamp ASC;
  `;
  try {
    const result = await pool.query(query, [otherUserId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

module.exports = {
  createUserChatTable,
  sendMessage,
  getMessages
};
