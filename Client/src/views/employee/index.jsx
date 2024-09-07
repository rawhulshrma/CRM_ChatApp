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
import { employeeActions } from '../../action/entity/entityAction';

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

const EmployeeList = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ name: '', email: '', password: '', role: '', color: 'default', enabled: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { employees = [], loading: employeesLoading, error: employeesError } = useSelector((state) => state.employee);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    dispatch(employeeActions.fetchAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentEmployee({ name: '', email: '', password: '', role: '', color: 'default', enabled: true });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (employee) => {
    setCurrentEmployee(employee);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentEmployee((prev) => ({ ...prev, [name]: name === 'enabled' ? checked : value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentEmployee.name || !currentEmployee.email || !currentEmployee.password || !currentEmployee.role) {
      return;
    }

    if (currentEmployee.id) {
      dispatch(employeeActions.updateProfile(currentEmployee));
    } else {
      dispatch(employeeActions.create(currentEmployee));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, employeeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployeeId(null);
  };

  const handleEdit = () => {
    const employeeToEdit = employees.find((e) => e.id === selectedEmployeeId);
    setCurrentEmployee(employeeToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleUpdatePassword = () => {
    console.log('Update password for employee', selectedEmployeeId);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete employee', selectedEmployeeId);
    handleMenuClose();
  };

  const handleShow = (employee) => {
    handleDetailsDrawerOpen(employee);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee List
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
            onClick={() => dispatch(employeeActions.fetchAll())}
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
            Add New Employee
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
            {employeesLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : employeesError ? (
              <TableRow>
                <TableCell colSpan={6}>Error loading employees: {employeesError}</TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No employees found</TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <ColorBadge color={employee.color}>
                    </ColorBadge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={employee.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, employee.id)}>
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
        <MenuItem onClick={() => handleShow(employees.find(e => e.id === selectedEmployeeId))}>
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
            {currentEmployee.id ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentEmployee.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={currentEmployee.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={currentEmployee.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Role"
            name="role"
            value={currentEmployee.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Select
            native
            name="color"
            value={currentEmployee.color}
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
              checked={currentEmployee.enabled}
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
              {currentEmployee.id ? 'Update' : 'Add'}
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
            Employee Details
          </Typography>
          <Typography variant="body1">Name: {currentEmployee.name}</Typography>
          <Typography variant="body1">Email: {currentEmployee.email}</Typography>
          <Typography variant="body1">Role: {currentEmployee.role}</Typography>
          <Typography variant="body1">Color: {currentEmployee.color}</Typography>
          <Typography variant="body1">Enabled: {currentEmployee.enabled ? 'Yes' : 'No'}</Typography>
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

export default EmployeeList;

