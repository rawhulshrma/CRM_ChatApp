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
import { peopleActions } from '../../../action/application/applicationAction';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const index = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentPeople, setCurrentPeople] = useState({ name: '', email: '', phone: '',company: '', country: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { peoples = [], loading, error } = useSelector((state) => state.people);
  console.log('Redux State:', { peoples, loading, error });
  
  useEffect(() => {
    console.log('Fetched Peoples:', peoples);
  }, [peoples]);


  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeopleId, setSelectedPeopleId] = useState(null);

  useEffect(() => {
    dispatch(peopleActions.getAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentPeople({ name: '', email: '', phone: '', address: '' });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (people) => {
    setCurrentPeople(people);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPeople((prev) => ({ ...prev, [name]: value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentPeople.name || !currentPeople.email) {
      return;
    }

    if (currentPeople.id) {
      dispatch(peopleActions.update({ id: currentPeople.id, data: currentPeople }));
    } else {
      dispatch(peopleActions.create(currentPeople));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, peopleId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPeopleId(peopleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPeopleId(null);
  };

  const handleEdit = () => {
    const peopleToEdit = peoples.find((p) => p.id === selectedPeopleId);
    setCurrentPeople(peopleToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(peopleActions.delete(selectedPeopleId));
    handleMenuClose();
  };

  const handleShow = (people) => {
    handleDetailsDrawerOpen(people);
  };

  const filteredPeople = Array.isArray(peoples)
  ? peoples.filter((people) =>
      people.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];




  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        People List
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
            onClick={() => dispatch(peopleActions.getAll())}
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
            Add New Person
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
              <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Company</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Country</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) :error ? (
              <TableRow>
                <TableCell colSpan={5}>Error loading people: {peoplesError}</TableCell>
              </TableRow>
            ) : filteredPeople.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No people found</TableCell>
              </TableRow>
            ) : (
              filteredPeople.map((people) => (
                <TableRow key={people.id}>
                  <TableCell>{people.name}</TableCell>
                  <TableCell>{people.email}</TableCell>
                  <TableCell>{people.phone}</TableCell>
                  <TableCell>{people.company}</TableCell>
                  <TableCell>{people.country}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, people.id)}>
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
        <MenuItem onClick={() => handleShow(people.find(p => p.id === selectedPeopleId))}>
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
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Add a box shadow for the 3D effect
      borderRadius: '8px', // Optional: add border radius for a softer look
      transform: 'translateY(-5px)', // Slightly lift the form up
    },
  }}
>
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      {currentPeople.id ? 'Edit Person' : 'Add New Person'}
    </Typography>
    <TextField
      label="Name"
      name="name"
      value={currentPeople.name}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
    <TextField
      label="Email"
      name="email"
      value={currentPeople.email}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
    <TextField
      label="Phone"
      name="phone"
      value={currentPeople.phone}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
    <TextField
      label="Country"
      name="country"
      value={currentPeople.country}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
    <TextField
      label="Company"
      name="company"
      value={currentPeople.company}
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
        {currentPeople.id ? 'Update' : 'Add'}
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
            People Details
          </Typography>
          <Typography variant="body1">Name: {currentPeople.name}</Typography>
          <Typography variant="body1">Email: {currentPeople.email}</Typography>
          <Typography variant="body1">Phone: {currentPeople.phone}</Typography>
          <Typography variant="body1">Company : {currentPeople.company}</Typography>
          <Typography variant="body1">Country : {currentPeople.country}</Typography>
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

export default index;