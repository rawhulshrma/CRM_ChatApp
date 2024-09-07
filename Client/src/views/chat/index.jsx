import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f0f2f5', // Light, neutral background
      }}
    >
      <Sidebar onUserClick={handleUserClick} />
      {selectedUser ? (
        <ChatWindow selectedUser={selectedUser} />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Typography variant="h4" color="textSecondary">
            Select a user to start chatting
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
