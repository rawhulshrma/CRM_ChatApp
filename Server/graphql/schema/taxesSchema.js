const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const TaxModel = require('../../models/settings/taxesModels');  // Import your existing Tax model
const ErrorHandler = require('../../utils/errorHandler');

// Define Tax Type
const TaxType = new GraphQLObjectType({
  name: 'Tax',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    value: { type: GraphQLFloat },
  },
});

// Root Query for fetching all taxes or one tax by ID
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    taxes: {
      type: new GraphQLList(TaxType),
      resolve: async () => {
        try {
          const taxes = await TaxModel.getAllTaxes(); // Existing method from your model
          return taxes;
        } catch (error) {
          throw new ErrorHandler('Error fetching all taxes', 500);
        }
      },
    },
    tax: {
      type: TaxType,
      args: { id: { type: GraphQLInt } },
      resolve: async (parent, args) => {
        try {
          const tax = await TaxModel.getTaxById(args.id);  // Fetch tax by ID from your model
          if (!tax) {
            throw new ErrorHandler('Tax not found', 404);
          }
          return tax;
        } catch (error) {
          throw new ErrorHandler(`Error fetching tax with ID ${args.id}`, 500);
        }
      },
    },
  },
});

// Mutation for create, update, and delete
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTax: {
      type: TaxType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        value: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve: async (parent, args) => {
        try {
          const newTax = await TaxModel.createTax({ name: args.name, value: args.value });  // Insert tax into DB
          return newTax;
        } catch (error) {
          if (error.code === '23505') {  // Assuming unique constraint error
            throw new ErrorHandler('Tax with this name already exists', 409);
          }
          throw new ErrorHandler('Error creating tax', 500);
        }
      },
    },
    updateTax: {
      type: TaxType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        value: { type: GraphQLFloat },
      },
      resolve: async (parent, args) => {
        try {
          const updatedTax = await TaxModel.updateTax(args.id, { name: args.name, value: args.value });  // Update tax in DB
          return updatedTax;
        } catch (error) {
          if (error.code === '23505') {
            throw new ErrorHandler('Tax with this name already exists', 409);
          }
          throw new ErrorHandler('Error updating tax', 500);
        }
      },
    },
    deleteTax: {
      type: TaxType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        try {
          const deletedTax = await TaxModel.deleteTax(args.id);  // Delete tax from DB
          return deletedTax;
        } catch (error) {
          throw new ErrorHandler('Error deleting tax', 500);
        }
      },
    },
  },
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
