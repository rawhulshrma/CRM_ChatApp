import { combineReducers } from '@reduxjs/toolkit';
import ownerReducer from '../slice/ownerSlice'; // Corrected path and import
import { adminReducer,managerReducer, employeeReducer } from '../slice/entity/entitySlice';
import customizationReducer from './customizationReducer';
import authReducer  from '../slice/authSlice';
import {productCategoryReducer,productReducer}  from '../slice/product/productSlice';
import { companiesReducer, peopleReducer, customerReducer } from '../slice/application/applicationSlice';
import {invoiceReducer} from '../slice/invoice/invoiceSlice';
import { currencyReducer, taxReducer } from '../slice/settings/settingsSlice';
export default combineReducers({
    admin: adminReducer,
    tax: taxReducer,
    currency: currencyReducer,
    manager: managerReducer,
    invoice: invoiceReducer,
    productCategory : productCategoryReducer,
    product : productReducer,
    employee: employeeReducer,
    owner: ownerReducer,
    companies: companiesReducer,
    people: peopleReducer,
    customer: customerReducer,
    customization: customizationReducer,
    auth: authReducer
});

