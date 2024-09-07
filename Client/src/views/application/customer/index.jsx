import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, Refresh, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { customerActions } from '../../../action/application/applicationAction';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const CustomersIndex = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({ name: '', country: '', contact: '', phone: '', email: '', website: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { customers = [], loading, error } = useSelector((state) => state.customer);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    dispatch(customerActions.getAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentCustomer({ name: '', country: '', contact: '', phone: '', email: '', website: '' });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (customer) => {
    setCurrentCustomer(customer);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer((prev) => ({ ...prev, [name]: value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentCustomer.name) {
      return;
    }

    if (currentCustomer.id) {
      dispatch(customersAction.update({ id: currentCustomer.id, data: currentCustomer }));
    } else {
      dispatch(customersAction.create(currentCustomer));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, customerId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomerId(customerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId(null);
  };

  const handleEdit = () => {
    const customerToEdit = customers.find((c) => c.id === selectedCustomerId);
    setCurrentCustomer(customerToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(customersAction.delete(selectedCustomerId));
    handleMenuClose();
  };

  const handleShow = (customer) => {
    handleDetailsDrawerOpen(customer);
  };

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customers List
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '40%',
            '& .MuiOutlinedInput-root': {
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              '&:hover': {
                boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
              }
            }
          }}
        />
        <Box>
          <Button
            startIcon={<Refresh />}
            onClick={() => dispatch(customersAction.getAll())}
            sx={{
              mr: 1,
              backgroundColor: '#693bb8',
              color: '#fff',
              boxShadow: '0 3px 5px 2px rgba(105, 59, 184, .3)',
              transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              '&:hover': {
                backgroundColor: '#5a2a9b',
                boxShadow: '0 5px 15px rgba(105, 59, 184, .4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            sx={{
              backgroundColor: '#693bb8',
              color: '#fff',
              boxShadow: '0 3px 5px 2px rgba(105, 59, 184, .3)',
              transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              '&:hover': {
                backgroundColor: '#5a2a9b',
                boxShadow: '0 5px 15px rgba(105, 59, 184, .4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Add New Customer
          </Button>
        </Box>
      </Box>
      <TableContainer 
        component={Paper} 
        sx={{
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
            transform: 'translateY(-5px)'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Country</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Website</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7}>Error loading customers: {error}</TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No customers found</TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.country}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.website}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, customer.id)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleShow(customers.find(c => c.id === selectedCustomerId))}>
          <Visibility sx={{ mr: 1 }} /> Show
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: '400px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            transform: 'translateY(-5px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentCustomer.id ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentCustomer.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Country"
            name="country"
            value={currentCustomer.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contact"
            name="contact"
            value={currentCustomer.contact}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Phone"
            name="phone"
            value={currentCustomer.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={currentCustomer.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Website"
            name="website"
            value={currentCustomer.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDrawerClose}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
            >
              {currentCustomer.id ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={detailsDrawerOpen}
        onClose={handleDetailsDrawerClose}
        PaperProps={{
          sx: {
            width: '400px',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Customer Details
          </Typography>
          <Typography variant="body1">Name: {currentCustomer.name}</Typography>
          <Typography variant="body1">Country: {currentCustomer.country}</Typography>
          <Typography variant="body1">Contact: {currentCustomer.contact}</Typography>
          <Typography variant="body1">Phone: {currentCustomer.phone}</Typography>
          <Typography variant="body1">Email: {currentCustomer.email}</Typography>
          <Typography variant="body1">Website: {currentCustomer.website}</Typography>
          <Button
            variant="outlined"
            onClick={handleDetailsDrawerClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CustomersIndex;