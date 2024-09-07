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
  Switch,
  Slide,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  Badge
} from '@mui/material';
import {
  Add,
  Refresh,
  Close,
  MoreVert,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {branchActions} from '../../action/entity/entityAction';
import { keyframes } from '@mui/system';
import {countries} from '../../utility/country'; // Adjust the path as needed

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const ColorBadge = ({ color, children }) => {
  const getColor = (color) => {
    const colors = {
      default: '#1890ff',
      pink: '#eb2f96',
      red: '#f5222d',
      cyan: '#13c2c2',
      green: '#52c41a',
      purple: '#722ed1',
      volcano: '#fa541c',
      magenta: '#eb2f96'
    };
    return colors[color] || colors.default;
  };

  return (
    <Badge
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: getColor(color),
          color: 'white',
          padding: '0 4px',
          borderRadius: '4px'
        }
      }}
      badgeContent={color}
    >
      {children}
    </Badge>
  );
};

const Branch = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    color: 'default',
    enabled: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const dispatch = useDispatch();
  const { branches, loading, error } = useSelector((state) => state.branch);

  useEffect(() => {
    dispatch(branchActions.fetchAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentBranch({
      name: '',
      address: '',
      city: '',
      country: '',
      color: 'default',
      enabled: true
    });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (branch) => {
    setCurrentBranch(branch);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentBranch((prev) => ({
      ...prev,
      [name]: name === 'enabled' ? checked : value
    }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (Object.values(currentBranch).some((value) => !value)) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    dispatch(createBranch(currentBranch))
      .unwrap()
      .then(() => {
        dispatch(branchActions.fetchAll());
        handleDrawerClose();
        setSnackbarMessage('Branch created successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Failed to create branch.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleMenuOpen = (event, branchId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBranchId(branchId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBranchId(null);
  };

  const handleEdit = () => {
    console.log('Edit branch', selectedBranchId);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(deleteBranch(selectedBranchId))
      .unwrap()
      .then(() => {
        dispatch(branchActions.fetchAll());
        setSnackbarMessage('Branch deleted successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Failed to delete branch.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    handleMenuClose();
  };

  const handleShow = (branch) => {
    handleDetailsDrawerOpen(branch);
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Branch List
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '40%' }}
        />
        <Box>
          <Button
            startIcon={<Refresh />}
            onClick={() =>  dispatch(branchActions.fetchAll())}
            sx={{ mr: 1, backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
            variant="contained"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
          >
            Add New Branch
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Address</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">City</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Country</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Color</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Enabled</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.country}</TableCell>
                <TableCell>
                  <ColorBadge color={branch.color}>
                  </ColorBadge>
                </TableCell>
                <TableCell>
                  <Switch checked={branch.enabled} disabled />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, branch.id)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleShow(branches.find(b => b.id === selectedBranchId))}>
          <Visibility sx={{ mr: 1 }} /> Show
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Slide direction="right" in={drawerOpen} mountOnEnter unmountOnExit>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">Add Branch</Typography>
              <IconButton onClick={handleDrawerClose}>
                <Close />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentBranch.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { animation: shakeField === 'name' ? `${shakeAnimation} 0.5s` : 'none' }
              }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={currentBranch.address}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { animation: shakeField === 'address' ? `${shakeAnimation} 0.5s` : 'none' }
              }}
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={currentBranch.city}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { animation: shakeField === 'city' ? `${shakeAnimation} 0.5s` : 'none' }
              }}
            />
            <Box sx={{animation: shakeField === 'country' ? `${shakeAnimation} 0.5s` : 'none' }}>
            <Select
            labelId="country-select-label"
            fullWidth
            label="Country"
            name="country"
            value={currentBranch.country}
            onChange={handleChange}
            sx={{ mt: 2, animation: shakeField === 'country' ? `${shakeAnimation} 0.5s` : 'none' }}
          >
            {countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </Select>
            </Box>
            <Select
              fullWidth
              label="Color"
              name="color"
              value={currentBranch.color}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="pink">Pink</MenuItem>
              <MenuItem value="red">Red</MenuItem>
              <MenuItem value="cyan">Cyan</MenuItem>
              <MenuItem value="green">Green</MenuItem>
              <MenuItem value="purple">Purple</MenuItem>
              <MenuItem value="volcano">Volcano</MenuItem>
              <MenuItem value="magenta">Magenta</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Enabled</Typography>
              <Switch
                name="enabled"
                checked={currentBranch.enabled}
                onChange={handleChange}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
            >
              Submit
            </Button>
          </Box>
        </Slide>
      </Drawer>
      <Drawer anchor="right" open={detailsDrawerOpen} onClose={handleDetailsDrawerClose}>
        <Slide direction="right" in={detailsDrawerOpen} mountOnEnter unmountOnExit>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">Branch Details</Typography>
              <IconButton onClick={handleDetailsDrawerClose}>
                <Close />
              </IconButton>
            </Box>
            <Typography variant="h6" gutterBottom>Name: {currentBranch.name}</Typography>
            <Typography variant="h6" gutterBottom>Address: {currentBranch.address}</Typography>
            <Typography variant="h6" gutterBottom>City: {currentBranch.city}</Typography>
            <Typography variant="h6"><strong>Country:</strong> {countries.find(c => c.value === currentBranch.country)?.label || currentBranch.country}</Typography>
            <Typography variant="h6" gutterBottom>
              Color: <ColorBadge color={currentBranch.color}>{currentBranch.name}</ColorBadge>
            </Typography>
            <Typography variant="h6" gutterBottom>Enabled: {currentBranch.enabled ? 'Yes' : 'No'}</Typography>
          </Box>
        </Slide>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Branch;