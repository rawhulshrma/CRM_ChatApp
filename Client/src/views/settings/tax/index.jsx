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
import { taxActions } from '../../../action/settings/settingsAction';
import moment from 'moment';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const Taxes = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentTax, setCurrentTax] = useState({ name: '', value: '', created_at: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { taxs = [], loading, error } = useSelector((state) => state.tax);

  useEffect(() => {
    dispatch(taxActions.fetchAll());
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaxId, setSelectedTaxId] = useState(null);

  const handleDrawerOpen = () => {
    setCurrentTax({ name: '', value: '', created_at: '' });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (tax) => {
    setCurrentTax(tax);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTax((prev) => ({ ...prev, [name]: value }));
    
    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentTax.name || !currentTax.value) {
      return;
    }

    if (currentTax.id) {
      dispatch(taxActions.update({ id: currentTax.id, data: currentTax }));
    } else {
      dispatch(taxActions.create(currentTax));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, taxId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaxId(taxId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaxId(null);
  };

  const handleEdit = () => {
    const taxToEdit = taxs.find((t) => t.id === selectedTaxId);
    setCurrentTax(taxToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(taxActions.delete(selectedTaxId));
    handleMenuClose();
  };

  const handleShow = (tax) => {
    handleDetailsDrawerOpen(tax);
  };

  const filteredTaxes = taxs.filter((tax) =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (value) => parseFloat(value).toFixed(2) + '%';
  const formatDate = (date) => moment(date).format('DD-MM-YYYY');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Taxes List
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
            onClick={() => dispatch(taxActions.fetchAll())}
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
            Add New Tax
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
              <TableCell><Typography fontWeight="bold">Value (%)</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4}>Error loading taxes: {error}</TableCell>
              </TableRow>
            ) : filteredTaxes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No taxes found</TableCell>
              </TableRow>
            ) : (
              filteredTaxes.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell>{tax.name}</TableCell>
                  <TableCell>{formatValue(tax.value)}</TableCell>
                  <TableCell>{formatDate(tax.created_at)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, tax.id)}
                      aria-controls={`menu-${tax.id}`}
                      aria-haspopup="true"
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id={`menu-${tax.id}`}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedTaxId === tax.id)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>
                        <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleShow(tax)}>
                        <Visibility fontSize="small" sx={{ mr: 1 }} /> View
                      </MenuItem>
                      <MenuItem onClick={handleDelete}>
                        <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Drawer for creating/updating tax */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentTax.id ? 'Edit Tax' : 'Create Tax'}
          </Typography>
          <TextField
            label="Tax Name"
            name="name"
            value={currentTax.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              animation: shakeField === 'name' ? `${shakeAnimation} 0.5s` : 'none',
              boxShadow: shakeField === 'name' ? '0 0 5px red' : 'none',
            }}
          />
          <TextField
            label="Value (%)"
            name="value"
            value={currentTax.value}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={{
              animation: shakeField === 'value' ? `${shakeAnimation} 0.5s` : 'none',
              boxShadow: shakeField === 'value' ? '0 0 5px red' : 'none',
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDrawerClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#693bb8', color: '#fff' }}>
              {currentTax.id ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Drawer>
      {/* Drawer for viewing details */}
      <Drawer
        anchor="right"
        open={detailsDrawerOpen}
        onClose={handleDetailsDrawerClose}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Tax Details
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Name:</strong> {currentTax.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Value:</strong> {formatValue(currentTax.value)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Date:</strong> {formatDate(currentTax.created_at)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleDetailsDrawerClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Taxes;
