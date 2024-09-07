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
import { adminActions } from '../../action/entity/entityAction';

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

const AdminList = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({ name: '', email: '', password: '', role: '', color: 'default', enabled: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { admins = [], loading: adminsLoading, error: adminsError } = useSelector((state) => state.admin);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  useEffect(() => {
    dispatch(adminActions.fetchAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentAdmin({ name: '', email: '', password: '', role: '', color: 'default', enabled: true });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (admin) => {
    setCurrentAdmin(admin);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentAdmin((prev) => ({ ...prev, [name]: name === 'enabled' ? checked : value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentAdmin.name || !currentAdmin.email || !currentAdmin.password || !currentAdmin.role) {
      return;
    }

    if (currentAdmin.id) {
      dispatch(adminActions.updateProfile(currentAdmin));
    } else {
      dispatch(adminActions.create(currentAdmin));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, adminId) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdminId(adminId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdminId(null);
  };

  const handleEdit = () => {
    const adminToEdit = admins.find((a) => a.id === selectedAdminId);
    setCurrentAdmin(adminToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleUpdatePassword = () => {
    console.log('Update password for admin', selectedAdminId);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete admin', selectedAdminId);
    handleMenuClose();
  };

  const handleShow = (admin) => {
    handleDetailsDrawerOpen(admin);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin List
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
            onClick={() => dispatch(adminActions.fetchAll())}
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
            Add New Admin
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
            {adminsLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : adminsError ? (
              <TableRow>
                <TableCell colSpan={6}>Error loading admins: {adminsError}</TableCell>
              </TableRow>
            ) : filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No admins found</TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>
                    <ColorBadge color={admin.color}>
                     
                    </ColorBadge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={admin.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, admin.id)}>
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
        <MenuItem onClick={() => handleShow(admins.find(a => a.id === selectedAdminId))}>
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
            {currentAdmin.id ? 'Edit Admin' : 'Add New Admin'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentAdmin.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={currentAdmin.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={currentAdmin.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Role"
            name="role"
            value={currentAdmin.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Select
            native
            name="color"
            value={currentAdmin.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <option value="default">Default</option>
            <option value="pink">Pink</option>
            <option value="red">Red</option>
            <option value="cyan">Cyan</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="volcano">Volcano</option>
            <option value="magenta">Magenta</option>
          </Select>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography sx={{ mr: 2 }}>Enabled:</Typography>
            <Switch
              name="enabled"
              checked={currentAdmin.enabled}
              onChange={handleChange}
            />
          </Box>
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
              {currentAdmin.id ? 'Update' : 'Add'}
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
            Admin Details
          </Typography>
          <Typography variant="body1">Name: {currentAdmin.name}</Typography>
          <Typography variant="body1">Email: {currentAdmin.email}</Typography>
          <Typography variant="body1">Role: {currentAdmin.role}</Typography>
          <Typography variant="body1">Color: {currentAdmin.color}</Typography>
          <Typography variant="body1">Enabled: {currentAdmin.enabled ? 'Yes' : 'No'}</Typography>
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

export default AdminList;
