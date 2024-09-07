import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, Divider, Typography } from '@mui/material';

// Sample users data structure with lastMessage and online status
const users = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'path/to/avatar1.jpg',
    lastMessage: 'Hey, how are you?',
    online: true, // Online status
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'path/to/avatar2.jpg',
    lastMessage: 'Looking forward to our meeting!',
    online: false, // Offline status
  },
  // Add more users as needed
];

const Sidebar = ({ onUserClick }) => {
  return (
    <Box
      sx={{
        width: 300,
        bgcolor: 'rgba(255, 255, 255, 0.9)', // Glassy effect
        backdropFilter: 'blur(12px)', // Blurring effect
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Subtle shadow
        borderRadius: '12px',
        overflow: 'auto',
        padding: 2,
        height: '100vh',
      }}
    >
      <Box
        sx={{
          mb: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="textPrimary" gutterBottom>
          Users
        </Typography>
      </Box>
      <Divider />
      <List>
        {users.map((user) => (
          <ListItem
            button
            onClick={() => onUserClick(user)}
            key={user.id}
            sx={{
              '&:hover': {
                bgcolor: '#f0f0f0', // Light hover effect
              },
              borderRadius: '8px', // Rounded corners for list items
              transition: 'background-color 0.3s ease', // Smooth transition
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    border: '2px solid #693bb8', // Stylish border
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                  }}
                />
                {user.online && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'green', // Green color for online indicator
                      border: '2px solid white', // Optional white border for better visibility
                    }}
                  />
                )}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {user.lastMessage}
                </Typography>
              }
              primaryTypographyProps={{
                sx: {
                  fontWeight: 'bold', // Bolder text
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;