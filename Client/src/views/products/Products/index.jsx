import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Drawer,
    TextField,
    Slider,
    Rating,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { styled } from '@mui/system';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { productCategoryActions, productActions } from '../../../action/product/productAction';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
    },
}));

const CategoryButton = styled(Button)(({ theme, selected }) => ({
    margin: theme.spacing(0.5),
    borderRadius: '20px',
    backgroundColor: selected ? theme.palette.primary.main : 'transparent',
    color: selected ? theme.palette.primary.contrastText : theme.palette.primary.main,
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.dark : theme.palette.primary.light,
    },
}));

const FloatingTextField = styled(TextField)(({ theme }) => ({
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    },
}));

const StyledPaginationButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'rgb(105, 59, 184)',
    color: 'white',
    borderRadius: '5px',
    margin: theme.spacing(0.5),
    '&:hover': {
        backgroundColor: 'rgb(85, 49, 164)',
    },
}));


const ProductCatalog = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);
    const categories = useSelector(state => state.productCategory.productCategorys);
    const loading = useSelector(state => state.product.loading || state.productCategory.loading);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [addProductDrawerOpen, setAddProductDrawerOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        rating: 0,
        category: "",
        image: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    useEffect(() => {
        dispatch(productActions.fetchAll());
        dispatch(productCategoryActions.fetchAll());
    }, [dispatch]);

    const filteredProducts = products && products.length > 0 ? products.filter(product => 
        (selectedCategory === "All" || product.product_category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= priceRange[0] && product.price <= priceRange[1] &&
        product.ratings >= ratingFilter
    ) : [];

    const currentProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddProduct = () => {
        dispatch(productActions.create(newProduct));
        setAddProductDrawerOpen(false);
        setNewProduct({
            name: "",
            description: "",
            price: "",
            rating: 0,
            category: "",
            image: "",
        });
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', my: 4 }}>
            Product Catalog
        </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <FloatingTextField
                    variant="outlined"
                    placeholder="Search products..."
                    InputProps={{
                        startAdornment: <SearchIcon color="action" />,
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, mr: 2 }}
                />
                <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={() => setDrawerOpen(true)}
                    sx={{ backgroundColor: 'rgb(105, 59, 184)', '&:hover': { backgroundColor: 'rgb(85, 49, 164)' } }}
                >
                    Filter
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddProductDrawerOpen(true)}
                    sx={{ ml: 2, backgroundColor: 'rgb(105, 59, 184)', '&:hover': { backgroundColor: 'rgb(85, 49, 164)' } }}
                >
                    Add Product
                </Button>
            </Box>

            <Grid container spacing={4}>
                {currentProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <StyledCard>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.snapshot || "https://via.placeholder.com/300x200?text=Product+Image"}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                    <Rating value={product.ratings} precision={0.5} readOnly />
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ₹{product.price}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <StyledPaginationButton
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                >
                    Previous
                </StyledPaginationButton>
                <Typography variant="body2" sx={{ mx: 2 }}>
                    Page {page + 1} of {Math.ceil(filteredProducts.length / rowsPerPage)}
                </Typography>
                <StyledPaginationButton
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= Math.ceil(filteredProducts.length / rowsPerPage) - 1}
                >
                    Next
                </StyledPaginationButton>
            </Box>

            {/* Filter Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 350, p: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Filter Products
                    </Typography>

                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                        value={priceRange}
                        onChange={(e, newValue) => setPriceRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                    />

                    <Typography gutterBottom>Rating</Typography>
                    <Rating
                        value={ratingFilter}
                        onChange={(e, newValue) => setRatingFilter(newValue)}
                    />

                    <Typography gutterBottom>Category</Typography>
                    <Box>
                        <CategoryButton
                            key="All"
                            selected={selectedCategory === "All"}
                            onClick={() => setSelectedCategory("All")}
                        >
                            All
                        </CategoryButton>
                        {categories && categories.map(category => (
                            <CategoryButton
                                key={category.id}
                                selected={selectedCategory === category.name}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </CategoryButton>
                        ))}
                    </Box>
                </Box>
            </Drawer>

            {/* Add Product Drawer */}
            <Drawer anchor="right" open={addProductDrawerOpen} onClose={() => setAddProductDrawerOpen(false)}>
                <Box sx={{ width: 350, p: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Add New Product
                    </Typography>

                    <TextField
                        fullWidth
                        label="Product Name"
                        variant="outlined"
                        margin="normal"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />

                    <TextField
                        fullWidth
                        label="Price"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />

                    <Typography gutterBottom>Rating</Typography>
                    <Rating
                        value={newProduct.rating}
                        onChange={(e, newValue) => setNewProduct({ ...newProduct, rating: newValue })}
                    />

                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            label="Category"
                        >
                            {categories && categories.map(category => (
                                <MenuItem key={category.id} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Image URL"
                        variant="outlined"
                        margin="normal"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" onClick={handleAddProduct} sx={{ backgroundColor: 'rgb(105, 59, 184)', '&:hover': { backgroundColor: 'rgb(85, 49, 164)' } }}>
                            Add Product
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </Container>
    );
};

export default ProductCatalog;



