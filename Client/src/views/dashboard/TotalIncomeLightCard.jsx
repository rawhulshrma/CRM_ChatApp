import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../../action/product/productAction';

// Project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// Styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  borderRadius: '12px',
  transform: 'translateZ(0)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
  '&:after, &:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: '50%',
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    top: -30,
    filter: 'blur(30px)',
  },
  '&:after': {
    right: -180,
  },
  '&:before': {
    top: -160,
    right: -130,
  },
}));

// Dashboard - Total Income Light Card Component
const TotalIncomeLightCard = ({ icon, label }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(productActions.fetchAll());
  }, [dispatch]);

  if (loading) return <TotalIncomeCard />;
  if (error) return <p>Error: {error}</p>;

  const totalProducts = products.length;
  const totalAmount = products.reduce((sum, product) => {
    const price = parseFloat(product.price) || 0;
    return sum + price;
  }, 0);

  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <List disablePadding>
          <ListItem alignItems="center" disableGutters>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  boxShadow: theme.shadows[4],
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                {icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Total Products: {totalProducts}
                </Typography>
              }
              secondary={
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Total Amount: ₹{totalAmount.toFixed(2)}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>
    </CardWrapper>
  );
};

TotalIncomeLightCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export default TotalIncomeLightCard;