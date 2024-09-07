const express = require('express');
const router = express.Router();
const taxController = require('../../controllers/settings/taxesControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../../middleware/auth');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('../../graphql/schema/taxesSchema');


// Protected routes for admin and owner (view all taxes)
router.get(
  '/all',
  isAuthenticatedUser,
  authorizeRoles('admin', 'owner'),
  taxController.getAllTaxes
);

// Protected routes for owner
router.post(
  '/',
  isAuthenticatedUser,
  authorizeRoles('owner'),
  taxController.createTax
);

router.put(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('owner'),
  taxController.updateTax
);

router.delete(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('owner'),
  taxController.deleteTax
);

// Protected routes for admin and owner (view tax by ID)
router.get(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'owner'),
  taxController.getTaxById
);

router.use('/graphql', isAuthenticatedUser, authorizeRoles('admin', 'owner'), graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true, // Set to false in production
}));

module.exports = router;