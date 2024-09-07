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
import { productCategoryActions } from '../../../action/product/productAction';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const ColorBadge = ({ color, children }) => {
  return (
    <Badge
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: color,
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

const ProductCategoryList = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', color: '', owner_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { productCategorys = [], loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.productCategory);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    dispatch(productCategoryActions.fetchAll());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentCategory({ name: '', description: '', color: '', owner_id: '' });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (category) => {
    setCurrentCategory(category);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentCategory.name || !currentCategory.description || !currentCategory.color || !currentCategory.owner_id) {
      return;
    }

    if (currentCategory.id) {
      dispatch(productCategoryActions.update(currentCategory));
    } else {
      dispatch(productCategoryActions.create(currentCategory));
    }

    handleDrawerClose();
  };

  const handleMenuOpen = (event, categoryId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
  };

  const handleEdit = () => {
    const categoryToEdit = productCategorys.find((c) => c.id === selectedCategoryId);
    setCurrentCategory(categoryToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(productCategoryActions.remove(selectedCategoryId));
    handleMenuClose();
  };

  const handleShow = (category) => {
    handleDetailsDrawerOpen(category);
  };

  const filteredCategories = productCategorys.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Category List
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
            onClick={() => dispatch(productCategoryActions.fetchAll())}
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
            Add New Category
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Color</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Owner ID</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : categoriesError ? (
              <TableRow>
                <TableCell colSpan={5}>Error loading categories: {categoriesError}</TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No categories found</TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <ColorBadge color={category.color}>
                   
                    </ColorBadge>
                  </TableCell>
                  <TableCell>{category.owner_id}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, category.id)}>
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
        <MenuItem onClick={() => handleShow(productCategorys.find(c => c.id === selectedCategoryId))}>
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
            animation: shakeField ? `${shakeAnimation} 0.5s` : '',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentCategory.id ? 'Edit Category' : 'Add New Category'}
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={currentCategory.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={currentCategory.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Select
            native
            name="color"
            value={currentCategory.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <option value="">Select a color</option>
            <option value="#1890ff">Blue</option>
            <option value="#eb2f96">Pink</option>
            <option value="#f5222d">Red</option>
            <option value="#13c2c2">Cyan</option>
            <option value="#52c41a">Green</option>
            <option value="#722ed1">Purple</option>
            <option value="#fa541c">Orange</option>
            <option value="#eb2f96">Magenta</option>
          </Select>
          <TextField
            label="Owner ID"
            name="owner_id"
            value={currentCategory.owner_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="number"
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
              {currentCategory.id ? 'Update' : 'Add'}
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
            Category Details
          </Typography>
          <Typography variant="body1">Name: {currentCategory.name}</Typography>
          <Typography variant="body1">Description: {currentCategory.description}</Typography>
          <Typography variant="body1">
            Color: <ColorBadge color={currentCategory.color}>{currentCategory.color}</ColorBadge>
          </Typography>
          <Typography variant="body1">Owner ID: {currentCategory.owner_id}</Typography>
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

export default ProductCategoryList;