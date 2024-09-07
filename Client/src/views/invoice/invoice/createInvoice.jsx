import React, { useState, useEffect } from 'react';
import {
  TextField, Select, MenuItem, Button, Grid, Typography, Paper, IconButton,
  InputAdornment, Box, Fade, Grow
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { peopleActions } from '../../../action/application/applicationAction';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '50px',
  maxWidth: '1300px',
  margin: 'auto',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  borderRadius: '20px',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '12px 25px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },
}));

const fieldStyle = {
  marginBottom: '20px',
  '& .MuiInputBase-input': {
    padding: '15px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
    },
  },
};

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    client: '',
    number: '1',
    year: '2024',
    currency: 'US $ (US Dollar)',
    status: 'Draft',
    date: '',
    expireDate: '',
    note: '',
    items: [{ name: '', description: '', quantity: '', price: '' }],
    taxValue: ''
  });

  const dispatch = useDispatch();
  const { peoples = [], loading, error } = useSelector((state) => state.people);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', quantity: '', price: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubTotal = () => {
    return formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price) || 0), 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const taxRate = Number(formData.taxValue) || 0;
    return subTotal + (subTotal * taxRate / 100);
  };

  useEffect(() => {
    dispatch(peopleActions.getAll());
  }, [dispatch]);

  return (
    <Fade in={true} timeout={800}>
      <StyledPaper elevation={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <IconButton sx={{ color: '#1976d2', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}>
            <ArrowBackIcon fontSize="large" />
          </IconButton>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', letterSpacing: '-1px' }}>New Invoice</Typography>
          <Box>
            <StyledButton variant="outlined" sx={{ marginRight: '20px', borderColor: '#1976d2', color: '#1976d2' }}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" color="primary">
              + Save
            </StyledButton>
          </Box>
        </Box>
      
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              variant="outlined"
              sx={fieldStyle}
            >
              {peoples.map((person) => (
                <MenuItem key={person.id} value={person.name}>
                  {person.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              variant="outlined"
              sx={fieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              variant="outlined"
              sx={fieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              variant="outlined"
              sx={fieldStyle}
            >
              <MenuItem value="US $ (US Dollar)">US $ (US Dollar)</MenuItem>
              <MenuItem value="€ (Euro)">€ (Euro)</MenuItem>
              <MenuItem value="£ (British Pound)">£ (British Pound)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              variant="outlined"
              sx={fieldStyle}
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              sx={fieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Expire Date"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              sx={fieldStyle}
            />
          </Grid>
        </Grid>
      
        {/* Items Section */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mt: 6, mb: 3 }}>Invoice Items</Typography>
        {formData.items.map((item, index) => (
          <Grow in={true} timeout={300 * (index + 1)} key={index}>
            <Box sx={{ marginTop: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Item Name"
                    variant="outlined"
                    sx={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Item Description"
                    variant="outlined"
                    sx={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    variant="outlined"
                    sx={fieldStyle}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">x</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    placeholder="Price"
                    variant="outlined"
                    sx={fieldStyle}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                  <IconButton onClick={() => removeItem(index)} color="error" sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}>
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Grow>
        ))}
        <StyledButton 
          variant="outlined" 
          color="secondary" 
          onClick={addItem} 
          sx={{ marginTop: '30px', borderColor: '#9c27b0', color: '#9c27b0' }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Add New Item
        </StyledButton>

        {/* Total Section */}
        <Box sx={{ marginTop: '50px', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#555', mb: 2 }}>Subtotal:</Typography>
              <Typography variant="h4" sx={{ color: '#1976d2' }}>${calculateSubTotal().toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Rate"
                name="taxValue"
                type="number"
                value={formData.taxValue}
                onChange={handleChange}
                variant="outlined"
                sx={fieldStyle}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#555', mt: 3, mb: 2 }}>Total:</Typography>
              <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>${calculateTotal().toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Fade>
  );
};

export default InvoiceForm;































// import React, { useState, useEffect } from 'react';
// import {
//   TextField, Select, MenuItem, Button, Grid, Typography, Paper, IconButton,
//   InputAdornment, Box, Fade, Grow
// } from '@mui/material';
// import { useSelector, useDispatch } from 'react-redux';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { peopleActions } from '../../../action/application/applicationAction';
// import { styled } from '@mui/system';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: '50px',
//   maxWidth: '1300px',
//   margin: 'auto',
//   boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
//   borderRadius: '20px',
//   backgroundColor: '#f8f9fa',
//   transition: 'all 0.3s ease-in-out',
//   '&:hover': {
//     boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
//   },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: '30px',
//   padding: '12px 25px',
//   fontWeight: 'bold',
//   textTransform: 'none',
//   transition: 'all 0.3s ease',
//   boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
//   },
// }));

// const fieldStyle = {
//   marginBottom: '20px',
//   '& .MuiInputBase-input': {
//     padding: '15px',
//   },
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '12px',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
//     },
//     '&.Mui-focused': {
//       boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
//     },
//   },
// };

// const InvoiceForm = () => {
//   const [formData, setFormData] = useState({
//     client: '',
//     number: '1',
//     year: '2024',
//     currency: 'US $ (US Dollar)',
//     status: 'Draft',
//     date: '',
//     expireDate: '',
//     note: '',
//     items: [{ name: '', description: '', quantity: '', price: '' }],
//     taxValue: ''
//   });

//   const dispatch = useDispatch();
//   const { peoples = [], loading, error } = useSelector((state) => state.people);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...formData.items];
//     newItems[index][field] = value;
//     setFormData({ ...formData, items: newItems });
//   };

//   const addItem = () => {
//     setFormData({
//       ...formData,
//       items: [...formData.items, { name: '', description: '', quantity: '', price: '' }]
//     });
//   };

//   const removeItem = (index) => {
//     const newItems = formData.items.filter((_, i) => i !== index);
//     setFormData({ ...formData, items: newItems });
//   };

//   const calculateSubTotal = () => {
//     return formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price) || 0), 0);
//   };

//   const calculateTotal = () => {
//     const subTotal = calculateSubTotal();
//     const taxRate = Number(formData.taxValue) || 0;
//     return subTotal + (subTotal * taxRate / 100);
//   };

//   useEffect(() => {
//     dispatch(peopleActions.getAll());
//   }, [dispatch]);

//   return (
//     <Fade in={true} timeout={800}>
//       <StyledPaper elevation={6}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
//           <IconButton sx={{ color: '#1976d2', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}>
//             <ArrowBackIcon fontSize="large" />
//           </IconButton>
//           <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', letterSpacing: '-1px' }}>New Invoice</Typography>
//           <Box>
//             <StyledButton variant="outlined" sx={{ marginRight: '20px', borderColor: '#1976d2', color: '#1976d2' }}>
//               Cancel
//             </StyledButton>
//             <StyledButton variant="contained" color="primary">
//               + Save
//             </StyledButton>
//           </Box>
//         </Box>
      
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               select
//               fullWidth
//               label="Client"
//               name="client"
//               value={formData.client}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             >
//               {peoples.map((person) => (
//                 <MenuItem key={person.id} value={person.name}>
//                   {person.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               label="Number"
//               name="number"
//               value={formData.number}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             />
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <TextField
//               fullWidth
//               label="Year"
//               name="year"
//               value={formData.year}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             />
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <TextField
//               select
//               fullWidth
//               label="Currency"
//               name="currency"
//               value={formData.currency}
//               onChange={handleChange}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             >
//               <MenuItem value="US $ (US Dollar)">US $ (US Dollar)</MenuItem>
//               <MenuItem value="€ (Euro)">€ (Euro)</MenuItem>
//               <MenuItem value="£ (British Pound)">£ (British Pound)</MenuItem>
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <TextField
//               select
//               fullWidth
//               label="Status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               variant="outlined"
//               sx={fieldStyle}
//             >
//               <MenuItem value="Draft">Draft</MenuItem>
//               <MenuItem value="Sent">Sent</MenuItem>
//               <MenuItem value="Paid">Paid</MenuItem>
//               <MenuItem value="Cancelled">Cancelled</MenuItem>
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               type="date"
//               label="Date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               type="date"
//               label="Expire Date"
//               name="expireDate"
//               value={formData.expireDate}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               required
//               variant="outlined"
//               sx={fieldStyle}
//             />
//           </Grid>
//         </Grid>
      
//         {/* Items Section */}
//         <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mt: 6, mb: 3 }}>Invoice Items</Typography>
//         {formData.items.map((item, index) => (
//           <Grow in={true} timeout={300 * (index + 1)} key={index}>
//             <Box sx={{ marginTop: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Item Name"
//                     value={item.name}
//                     onChange={(e) => handleItemChange(index, 'name', e.target.value)}
//                     placeholder="Item Name"
//                     variant="outlined"
//                     sx={fieldStyle}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Description"
//                     value={item.description}
//                     onChange={(e) => handleItemChange(index, 'description', e.target.value)}
//                     placeholder="Item Description"
//                     variant="outlined"
//                     sx={fieldStyle}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <TextField
//                     fullWidth
//                     label="Quantity"
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                     placeholder="Quantity"
//                     variant="outlined"
//                     sx={fieldStyle}
//                     InputProps={{
//                       startAdornment: <InputAdornment position="start">x</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <TextField
//                     fullWidth
//                     label="Price"
//                     type="number"
//                     value={item.price}
//                     onChange={(e) => handleItemChange(index, 'price', e.target.value)}
//                     placeholder="Price"
//                     variant="outlined"
//                     sx={fieldStyle}
//                     InputProps={{
//                       startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
//                   <IconButton onClick={() => removeItem(index)} color="error" sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}>
//                     <DeleteIcon fontSize="large" />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grow>
//         ))}
//         <StyledButton 
//           variant="outlined" 
//           color="secondary" 
//           onClick={addItem} 
//           sx={{ marginTop: '30px', borderColor: '#9c27b0', color: '#9c27b0' }}
//           startIcon={<AddCircleOutlineIcon />}
//         >
//           Add New Item
//         </StyledButton>

//         {/* Total Section */}
//         <Box sx={{ marginTop: '50px', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#555', mb: 2 }}>Subtotal:</Typography>
//               <Typography variant="h4" sx={{ color: '#1976d2' }}>${calculateSubTotal().toFixed(2)}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Tax Rate"
//                 name="taxValue"
//                 type="number"
//                 value={formData.taxValue}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={fieldStyle}
//                 InputProps={{
//                   endAdornment: <InputAdornment position="end">%</InputAdornment>,
//                 }}
//               />
//               <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#555', mt: 3, mb: 2 }}>Total:</Typography>
//               <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>${calculateTotal().toFixed(2)}</Typography>
//             </Grid>
//           </Grid>
//         </Box>
//       </StyledPaper>
//     </Fade>
//   );
// };

// export default InvoiceForm;