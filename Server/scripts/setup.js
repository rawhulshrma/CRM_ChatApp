const { createOwnerTable, getOwnerByEmail, createInitialOwner } = require('../models/owner/ownerModels');
const { createUserTable } = require('../models/user/userModels'); // Import the function to create the user table

const initialOwnerData = {
  name: process.env.OWNER_NAME,
  email: process.env.OWNER_EMAIL,
  password: process.env.OWNER_PASSWORD,
  avatar: process.env.OWNER_AVATAR,
  role: process.env.OWNER_ROLE || 'owner', // Default value "owner"
};

const setup = async () => {
  try {
    // Create the user table first
    await createUserTable();
    console.log('User table created successfully');

    // Create the owner table
    await createOwnerTable();
    console.log('Owner table created successfully');

    // Check if the owner already exists
    const existingOwner = await getOwnerByEmail(initialOwnerData.email);
    if (existingOwner) {
      console.log('Owner already exists');
    } else {
      // Create the initial owner
      await createInitialOwner(initialOwnerData);
    }
  } catch (error) {
    console.error('Error setting up owner and user:', error);
  }
};

// Run the setup script
setup().catch(error => {
  console.error('Unhandled error during setup:', error);
  process.exit(1);
});
