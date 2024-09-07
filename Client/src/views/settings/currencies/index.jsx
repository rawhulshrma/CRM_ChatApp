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
  Snackbar,
  CircularProgress,
  Select,
  Badge,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Refresh, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { currencyActions } from '../../../action/settings/settingsAction';
import countries from './Countries'; // Import the countries list

// Badge component for displaying color
const ColorBadge = ({ color, children }) => (
  <Badge
    sx={{
      '& .MuiBadge-badge': {
        backgroundColor: color,
        color: 'white',
        padding: '0 4px',
        borderRadius: '4px',
      },
    }}
    badgeContent={children}
  >
    <Box sx={{ width: 20, height: 20 }} />
  </Badge>
);

// Main component for currency management
const CurrencyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState({
    name: '',
    code: '',
    symbol: '',
    decimal_separator: '',
    thousand_separator: '',
    cent_precision: 0,
    color: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [countryList, setCountryList] = useState([]);

  const dispatch = useDispatch();
  const { currencys = [], loading: currencyLoading, error: currencyError } = useSelector((state) => state.currency);

  const colorOptions = [
    { value: '#1890ff', label: 'Blue' },
    { value: '#eb2f96', label: 'Pink' },
    { value: '#f5222d', label: 'Red' },
    { value: '#13c2c2', label: 'Cyan' },
    { value: '#52c41a', label: 'Green' },
    { value: '#722ed1', label: 'Purple' },
    { value: '#fa541c', label: 'Orange' },
    { value: '#faad14', label: 'Yellow' },
  ];

  useEffect(() => {
    dispatch(currencyActions.fetchAll());
    setCountryList(countries);
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentCurrency({
      name: '',
      code: '',
      symbol: '',
      decimal_separator: '',
      thousand_separator: '',
      cent_precision: 0,
      color: '',
    });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => setDrawerOpen(false);

  const handleDetailsDrawerOpen = (currency) => {
    setCurrentCurrency(currency);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => setDetailsDrawerOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCurrency((prev) => ({ ...prev, [name]: value }));

    // Auto-fill code and symbol when country is selected
    if (name === 'name') {
      const selectedCountry = countries.find(country => country.CountryName === value);
      if (selectedCountry) {
        setCurrentCurrency(prev => ({
          ...prev,
          name: value,
          code: selectedCountry.Code,
          symbol: selectedCountry.Symbol
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (currentCurrency.name && currentCurrency.code) {
      const newCurrency = { ...currentCurrency, id: currentCurrency.id || Date.now() };
      if (currentCurrency.id) {
        // Update currency
        dispatch(currencyActions.update(newCurrency));
        setSnackbarMessage('Currency updated successfully!');
      } else {
        // Add new currency
        dispatch(currencyActions.add(newCurrency));
        setSnackbarMessage('Currency added successfully!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleDrawerClose();
    } else {
      setSnackbarMessage('Please fill all required fields!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleMenuOpen = (event, currencyId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCurrencyId(currencyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCurrencyId(null);
  };

  const handleEdit = () => {
    const currencyToEdit = currencys.find((c) => c.id === selectedCurrencyId);
    setCurrentCurrency(currencyToEdit);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(currencyActions.delete(selectedCurrencyId));
    setSnackbarMessage('Currency deleted successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const filteredCurrencies = currencys.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorName = (colorValue) => {
    const colorOption = colorOptions.find((option) => option.value === colorValue);
    return colorOption ? colorOption.label : colorValue;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Currency Management
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
            onClick={() => dispatch(currencyActions.fetchAll())}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            color="primary"
          >
            Add New Currency
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Decimal Separator</TableCell>
              <TableCell>Thousand Separator</TableCell>
              <TableCell>Cent Precision</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCurrencies.map((currency) => (
              <TableRow key={currency.id}>
                <TableCell>{currency.name}</TableCell>
                <TableCell>{currency.code}</TableCell>
                <TableCell>
                  <ColorBadge color={currency.color}>
                    {getColorName(currency.color)}
                  </ColorBadge>
                </TableCell>
                <TableCell>{currency.symbol}</TableCell>
                <TableCell>{currency.decimal_separator}</TableCell>
                <TableCell>{currency.thousand_separator}</TableCell>
                <TableCell>{currency.cent_precision}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuOpen(event, currency.id)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedCurrencyId === currency.id)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>
                      <Edit fontSize="small" /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleDetailsDrawerOpen(currency)}>
                      <Visibility fontSize="small" /> View Details
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <Delete fontSize="small" /> Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentCurrency.id ? 'Edit Currency' : 'Add New Currency'}
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Country/Currency Name</InputLabel>
            <Select
              name="name"
              value={currentCurrency.name}
              onChange={handleChange}
              label="Country/Currency Name"
            >
              {countryList.map((country) => (
                <MenuItem key={country.CountryName} value={country.CountryName}>
                  {country.CountryName} ({country.Currency})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={currentCurrency.code}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Symbol"
            name="symbol"
            value={currentCurrency.symbol}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select
              name="color"
              value={currentCurrency.color}
              onChange={handleChange}
              label="Color"
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <ColorBadge color={option.value} />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Decimal Separator"
            name="decimal_separator"
            value={currentCurrency.decimal_separator}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Thousand Separator"
            name="thousand_separator"
            value={currentCurrency.thousand_separator}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Cent Precision"
            type="number"
            name="cent_precision"
            value={currentCurrency.cent_precision}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDrawerClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {currentCurrency.id ? 'Update Currency' : 'Add Currency'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={detailsDrawerOpen} onClose={handleDetailsDrawerClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Currency Details
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {currentCurrency.name}
          </Typography>
          <Typography variant="body1">
            <strong>Code:</strong> {currentCurrency.code}
          </Typography>
          <Typography variant="body1">
            <strong>Symbol:</strong> {currentCurrency.symbol}
          </Typography>
          <Typography variant="body1">
            <strong>Color:</strong> <ColorBadge color={currentCurrency.color} />
          </Typography>
          <Typography variant="body1">
            <strong>Decimal Separator:</strong> {currentCurrency.decimal_separator}
          </Typography>
          <Typography variant="body1">
            <strong>Thousand Separator:</strong> {currentCurrency.thousand_separator}
          </Typography>
          <Typography variant="body1">
            <strong>Cent Precision:</strong> {currentCurrency.cent_precision}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleDetailsDrawerClose} color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default CurrencyManagement;