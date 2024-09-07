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
  Menu,
  MenuItem,
  Badge,
  Select,
} from '@mui/material';
import { Add, Refresh, MoreVert, Edit, VpnKey, Delete, Visibility } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { managerActions } from '../../action/entity/entityAction'; // Update to managerActions

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

const ManagerList = () => { // Update component name
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState({ name: '', email: '', password: '', role: '', color: 'default', enabled: true }); // Update variable names
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { managers = [], loading: managersLoading, error: managersError } = useSelector((state) => state.manager); // Update selector
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState(null);

  useEffect(() => {
    dispatch(managerActions.fetchAll()); // Update action
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentManager({ name: '', email: '', password: '', role: '', color: 'default', enabled: true });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (manager) => {
    setCurrentManager(manager);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentManager((prev) => ({ ...prev, [name]: name === 'enabled' ? checked : value }));
    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentManager.name || !currentManager.email || !currentManager.password || !currentManager.role) {
      return;
    }
    if (currentManager.id) {
      dispatch(managerActions.updateProfile(currentManager)); // Update action
    } else {
      dispatch(managerActions.create(currentManager)); // Update action
    }
    handleDrawerClose();
  };

  const handleMenuOpen = (event, managerId) => {
    setAnchorEl(event.currentTarget);
    setSelectedManagerId(managerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedManagerId(null);
  };

  const handleEdit = () => {
    const managerToEdit = managers.find((m) => m.id === selectedManagerId); // Update variable name
    setCurrentManager(managerToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleUpdatePassword = () => {
    console.log('Update password for manager', selectedManagerId);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete manager', selectedManagerId);
    handleMenuClose();
  };

  const handleShow = (manager) => {
    handleDetailsDrawerOpen(manager);
  };

  const filteredManagers = managers.filter((manager) =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manager List
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
            onClick={() => dispatch(managerActions.fetchAll())} // Update action
            sx={{ mr: 1, backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
            variant="contained"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
          >
            Add New Manager
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Role</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Color</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Enabled</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managersLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : managersError ? (
              <TableRow>
                <TableCell colSpan={6}>Error loading managers: {managersError}</TableCell>
              </TableRow>
            ) : filteredManagers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No managers found</TableCell>
              </TableRow>
            ) : (
              filteredManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.name}</TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.role}</TableCell>
                  <TableCell>
                    <ColorBadge color={manager.color}>

                    </ColorBadge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={manager.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, manager.id)}>
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
        <MenuItem onClick={() => handleShow(managers.find(m => m.id === selectedManagerId))}>
          <Visibility sx={{ mr: 1 }} /> Show
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleUpdatePassword}>
          <VpnKey sx={{ mr: 1 }} /> Update Password
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
            animation: shakeField ? `${shakeAnimation} 0.5s` : '',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentManager.id ? 'Edit Manager' : 'Add New Manager'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentManager.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={currentManager.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          {!currentManager.id && (
            <TextField
              label="Password"
              name="password"
              value={currentManager.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          )}
          <TextField
            label="Role"
            name="role"
            value={currentManager.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <Select
            label="Color"
            name="color"
            value={currentManager.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
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
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Enabled:
            </Typography>
            <Switch
              checked={currentManager.enabled}
              onChange={handleChange}
              name="enabled"
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
              fullWidth
            >
              {currentManager.id ? 'Update Manager' : 'Add Manager'}
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={detailsDrawerOpen}
        onClose={handleDetailsDrawerClose}
        PaperProps={{ sx: { width: '400px' } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Manager Details
          </Typography>
          <Typography>Name: {currentManager.name}</Typography>
          <Typography>Email: {currentManager.email}</Typography>
          <Typography>Role: {currentManager.role}</Typography>
          <Typography>Color: {currentManager.color}</Typography>
          <Typography>Enabled: {currentManager.enabled ? 'Yes' : 'No'}</Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ManagerList; // Update export
