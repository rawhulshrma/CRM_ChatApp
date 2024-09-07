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
import { companiesActions } from '../../../action/application/applicationAction';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const CompaniesIndex = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({ name: '', contact: '', country: '', phone: '', email: '', website: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { companies = [], loading, error } = useSelector((state) => state.companies);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  useEffect(() => {
    dispatch(companiesActions.getAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentCompany({ name: '', contact: '', country: '', phone: '', email: '', website: '' });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (company) => {
    setCurrentCompany(company);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompany((prev) => ({ ...prev, [name]: value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentCompany.name) {
      return;
    }

    if (currentCompany.id) {
      dispatch(companiesActions.update({ id: currentCompany.id, data: currentCompany }));
    } else {
      dispatch(companiesActions.create(currentCompany));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, companyId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompanyId(companyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompanyId(null);
  };

  const handleEdit = () => {
    const companyToEdit = companies.find((c) => c.id === selectedCompanyId);
    setCurrentCompany(companyToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(companiesActions.delete(selectedCompanyId));
    handleMenuClose();
  };

  const handleShow = (company) => {
    handleDetailsDrawerOpen(company);
  };

  const filteredCompanies = Array.isArray(companies)
    ? companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Companies List
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
            onClick={() => dispatch(companiesActions.getAll())}
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
            Add New Company
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
              <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Country</Typography></TableCell>
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
                <TableCell colSpan={7}>Error loading companies: {error}</TableCell>
              </TableRow>
            ) : filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No companies found</TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.contact}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.website}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, company.id)}>
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
        <MenuItem onClick={() => handleShow(companies.find(c => c.id === selectedCompanyId))}>
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
            {currentCompany.id ? 'Edit Company' : 'Add New Company'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentCompany.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contact"
            name="contact"
            value={currentCompany.contact}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Country"
            name="country"
            value={currentCompany.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Phone"
            name="phone"
            value={currentCompany.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={currentCompany.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Website"
            name="website"
            value={currentCompany.website}
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
              {currentCompany.id ? 'Update' : 'Add'}
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
            Company Details
          </Typography>
          <Typography variant="body1">Name: {currentCompany.name}</Typography>
          <Typography variant="body1">Contact: {currentCompany.contact}</Typography>
          <Typography variant="body1">Country: {currentCompany.country}</Typography>
          <Typography variant="body1">Phone: {currentCompany.phone}</Typography>
          <Typography variant="body1">Email: {currentCompany.email}</Typography>
          <Typography variant="body1">Website: {currentCompany.website}</Typography>
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

export default CompaniesIndex;