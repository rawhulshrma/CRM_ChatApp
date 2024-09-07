const adminRoutes = require('./admin/adminRoutes');
const ownerRoutes = require('./owner/ownerRoutes');
const managerRoutes = require('./manager/managerRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const chatRoutes = require('./chat/chatRoutes');
const companiesRoutes = require('./application/companiesRoutes');
const customerRoutes = require('./application/customerRoutes');
const peopleRoutes = require('./application/peopleRoutes');
const authRoutes = require('./auth/authRoutes');
const productRoutes = require('./products/productsRoutes');
const productCategoryRoutes = require('./products/productsCategoryRoutes');

const setup = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/owner', ownerRoutes);
  app.use('/api/v1/manager', managerRoutes);
  app.use('/api/v1/employee', employeeRoutes);
  app.use('/api/v1/chat', chatRoutes);
  app.use('/api/v1/companies', companiesRoutes);
  app.use('/api/v1/customers', customerRoutes);
  app.use('/api/v1/people', peopleRoutes);
  app.use('/api/v1/category/product', productCategoryRoutes);
  app.use('/api/v1/product', productRoutes);

  // Default route
  app.get('/', (req, res) => {
    res.send('Welcome to CRM Database API');
  });
};

module.exports = { setup };