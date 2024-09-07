const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const pool = require('./config/db');

// Routes
const adminRoutes = require('./routes/admin/adminRoutes');
const invoiceRoutes = require('./routes/invoice/invoceRoutes');
const ownerRoutes = require('./routes/owner/onwerRoutes');
const managerRoutes = require('./routes/manager/managerRoutes');
const employeeRoutes = require('./routes/employee/employeeRoutes');
const chatRoutes = require('./routes/chat/chatRoutes');
const companiesRoutes = require('./routes/application/companiesRoutes');
const customerRoutes = require('./routes/application/customerRoutes');
const peopleRoutes = require('./routes/application/peopleRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const productRoutes = require('./routes/products/productsRoutes');
const productCategoryRoutes = require('./routes/products/productsCategoryRoutes'); // Product categories
const taxRoutes = require('./routes/settings/taxesRoutes'); // Taxes
const currencyRoutes = require('./routes/settings/currencyRoutes'); // Currency
// Models
const adminModel = require('./models/admin/adminModels');
const invoiceModel = require('./models/invoice/invoiceModels');
const ownerModel = require('./models/owner/ownerModels');
const managerModel = require('./models/manager/managerModels');
const employeeModel = require('./models/employee/employeeModels');
const chatModel = require('./models/chat/chatModels');
const companiesModel = require('./models/application/companiesModels');
const customerModel = require('./models/application/customerModels');
const peopleModel = require('./models/application/peopleModels');
const productModel = require('./models/products/productsModel');
const productCategoryModel = require('./models/products/productCategoryModel');
const taxModel = require('./models/settings/taxesModels'); // Taxes
const currencyModel = require('./models/settings/currencyModels'); // Currency
// Middleware
const errorMiddleware = require('./middleware/error');
const multer = require('multer');

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to CRM Database API');
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/owner', ownerRoutes);
app.use('/api/v1/manager', managerRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/companies', companiesRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/people', peopleRoutes);
app.use('/api/v1/productCategory', productCategoryRoutes); // Product categories
app.use('/api/v1/product', productRoutes); // Products
app.use('/api/v1/tax', taxRoutes); // Taxes
app.use('/api/v1/currency', currencyRoutes); 
// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('sendMessage', async ({ senderName, senderId, senderRole, receiverName, receiverId, receiverRole, message }) => {
    try {
      const newMessage = await chatModel.sendMessage(senderName, senderId, senderRole, receiverName, receiverId, receiverRole, message);
      io.to(receiverId).emit('newMessage', newMessage);
      io.to(senderId).emit('messageSent', newMessage);
      console.log(`Message sent from ${senderName} (${senderRole}) to ${receiverName} (${receiverRole})`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware to handle errors
app.use(errorMiddleware);

// Initialize database tables
const initializeTables = async () => {
  try {
    await Promise.all([
      adminModel.createAdminTable(),
      ownerModel.createOwnerTable(),
      managerModel.createManagerTable(),
      employeeModel.createEmployeeTable(),
      productCategoryModel.createProductCategoryTable(), // Initialize product categories table
      productModel.createProductsTable(),
      companiesModel.createCompaniesTable(),
      customerModel.createCustomersTable(),
      invoiceModel.createInvoiceTable(),
      peopleModel.createPeopleTable(),
      taxModel.createTaxesTable(), // Initialize taxes table
      currencyModel.createCurrencyTable()
    ]);
    console.log('All database tables initialized successfully.');
  } catch (err) {
    console.error('Error Initializing Tables:', err);
    process.exit(1);
  }
};

// Error handling for 404 routes
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Database connection and server start
const startServer = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    await initializeTables();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

// Start initialization and server
startServer();

module.exports = app;
