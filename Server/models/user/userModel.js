const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  getUserByEmail: async (email) => {
    const query = `
      SELECT id, email, password, role FROM (
        SELECT id, email, password, 'owner' as role FROM owner
        UNION ALL
        SELECT id, email, password, 'admin' as role FROM admin
        UNION ALL
        SELECT id, email, password, 'manager' as role FROM manager
        UNION ALL
        SELECT id, email, password, 'employee' as role FROM employee
      ) AS users
      WHERE LOWER(email) = LOWER($1)
    `;
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    const query = `
      SELECT id, email, role, 
             CASE 
               WHEN role = 'owner' THEN (SELECT name FROM owner WHERE id = users.id)
               WHEN role = 'admin' THEN (SELECT name FROM admin WHERE id = users.id)
               WHEN role = 'manager' THEN (SELECT name FROM manager WHERE id = users.id)
               WHEN role = 'employee' THEN (SELECT name FROM employee WHERE id = users.id)
             END AS name
      FROM (
        SELECT id, email, 'owner' as role FROM owner
        UNION ALL
        SELECT id, email, 'admin' as role FROM admin
        UNION ALL
        SELECT id, email, 'manager' as role FROM manager
        UNION ALL
        SELECT id, email, 'employee' as role FROM employee
      ) AS users
      WHERE id = $1
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },


  updateUserProfile: async (userId, role, updates) => {
    const allowedUpdates = ['name', 'email', 'avatar'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`);

    if (updateFields.length === 0) {
      return null;
    }

    const values = updateFields.map(field => updates[field.split(' = ')[0]]);
    const query = `
      UPDATE ${role}
      SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING id, name, email, avatar, role
    `;

    try {
      const result = await pool.query(query, [userId, ...values]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  },

  // New method to change password
  changePassword: async (userId, role, oldPassword, newPassword) => {
    const validRoles = ['owner', 'admin', 'manager', 'employee'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role specified');
    }

    try {
      // First, verify the old password
      const user = await pool.query(`SELECT password FROM ${role} WHERE id = $1`, [userId]);
      if (!user.rows[0]) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
      if (!isMatch) {
        throw new Error('Incorrect old password');
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password
      const query = `
        UPDATE ${role}
        SET password = $1
        WHERE id = $2
        RETURNING id
      `;
      const result = await pool.query(query, [hashedPassword, userId]);
      return result.rows[0] ? true : false;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
};

module.exports = userModel;
// const pool = require('../../config/db');
// const bcrypt = require('bcrypt');

// const userModel = {
//   getUserByEmail: async (email) => {
//     const query = `
//       SELECT id, email, password, role FROM (
//         SELECT id, email, password, 'owner' as role FROM owner
//         UNION ALL
//         SELECT id, email, password, 'admin' as role FROM admin
//         UNION ALL
//         SELECT id, email, password, 'manager' as role FROM manager
//         UNION ALL
//         SELECT id, email, password, 'employee' as role FROM employee
//       ) AS users
//       WHERE LOWER(email) = LOWER($1)
//     `;
//     try {
//       const result = await pool.query(query, [email]);
//       return result.rows[0] || null;
//     } catch (error) {
//       console.error('Error in getUserByEmail:', error);
//       throw error;
//     }
//   },

//   getUserById: async (id, role) => {
//     const validRoles = ['owner', 'admin', 'manager', 'employee'];
//     if (!validRoles.includes(role)) {
//       throw new Error('Invalid role specified');
//     }
//     const query = `SELECT id, name, email, avatar, role FROM ${role} WHERE id = $1`;
//     try {
//       const result = await pool.query(query, [id]);
//       return result.rows[0] || null;
//     } catch (error) {
//       console.error('Error in getUserById:', error);
//       throw error;
//     }
//   },

//   updateUserProfile: async (userId, role, updates) => {
//     const allowedUpdates = ['name', 'email', 'avatar'];
//     const updateFields = Object.keys(updates)
//       .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
//       .map((key, index) => `${key} = $${index + 2}`);

//     if (updateFields.length === 0) {
//       return null;
//     }

//     const values = updateFields.map(field => updates[field.split(' = ')[0]]);
//     const query = `
//       UPDATE ${role}
//       SET ${updateFields.join(', ')}
//       WHERE id = $1
//       RETURNING id, name, email, avatar, role
//     `;

//     try {
//       const result = await pool.query(query, [userId, ...values]);
//       return result.rows[0] || null;
//     } catch (error) {
//       console.error('Error in updateUserProfile:', error);
//       throw error;
//     }
//   },

//   // New method to change password
//   changePassword: async (userId, role, oldPassword, newPassword) => {
//     const validRoles = ['owner', 'admin', 'manager', 'employee'];
//     if (!validRoles.includes(role)) {
//       throw new Error('Invalid role specified');
//     }

//     try {
//       // First, verify the old password
//       const user = await pool.query(`SELECT password FROM ${role} WHERE id = $1`, [userId]);
//       if (!user.rows[0]) {
//         throw new Error('User not found');
//       }

//       const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
//       if (!isMatch) {
//         throw new Error('Incorrect old password');
//       }

//       // Hash the new password
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//       // Update the password
//       const query = `
//         UPDATE ${role}
//         SET password = $1
//         WHERE id = $2
//         RETURNING id
//       `;
//       const result = await pool.query(query, [hashedPassword, userId]);
//       return result.rows[0] ? true : false;
//     } catch (error) {
//       console.error('Error in changePassword:', error);
//       throw error;
//     }
//   }
// };

// module.exports = userModel;