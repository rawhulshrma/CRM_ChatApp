import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Divider, Avatar } from '@mui/material';
import { gsap } from 'gsap';

// Sample messages, replace with your actual messages data
const sampleMessages = [
  { sender: 'admin', text: 'Hello! How can I help you today?', avatar: '/path/to/admin-avatar.jpg' },
  { sender: 'user', text: 'I have a question about your services.', avatar: '/path/to/user-avatar.jpg' },
];

const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(sampleMessages);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = { sender: 'user', text: message, avatar: '/path/to/user-avatar.jpg' };
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage('');

      // Animate new message to slide up from the bottom
      gsap.fromTo(endOfMessagesRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 });
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.animation = 'shake 0.3s ease';
      setTimeout(() => {
        inputRef.current.style.animation = ''; // Reset animation
      }, 300); // Remove shake effect after 300ms
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Full page height
        width: '100%', // Full page width
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // 3D effect for container
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative', // Ensure positioning is relative
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto', // Enables scrolling for long message lists
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar
          },
        }}
      >
        {chatMessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: msg.sender === 'admin' ? 'row' : 'row-reverse',
              alignItems: 'flex-start',
              gap: 1,
              mb: 2,
              opacity: 0, // Initial opacity for animation
              animation: 'fadeIn 0.5s forwards', // Fade-in animation
              animationDelay: `${index * 100}ms`, // Staggered animation
            }}
          >
            <Avatar 
              src={msg.avatar} 
              alt={`${msg.sender} avatar`} 
              sx={{ width: 40, height: 40 }} // Size of avatar
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'admin' ? 'flex-start' : 'flex-end',
                gap: 0.5,
                maxWidth: '60%', // Reduced maxWidth for message container
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: msg.sender === 'admin' ? '#e1f5fe' : '#693bb8', // Change to #693bb8 for user messages
                  color: msg.sender === 'admin' ? '#000' : '#fff',
                  borderRadius: '20px', // Increased border radius for floating effect
                  padding: '10px 14px', // Adjusted padding for smaller size
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // 3D effect for messages
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'inline-block',
                  position: 'relative',
                  transition: 'all 0.3s ease', // Smooth transition for appearance
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={endOfMessagesRef} /> {/* Scrolls to the bottom */}
      </Box>
      <Divider />
      <Box
        sx={{
          padding: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #ddd',
          boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)', // Shadow for input area
          position: 'absolute', // Position it absolutely
          bottom: '20px', // Move it further up from the bottom
          left: 0,
          right: 0,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          inputRef={inputRef} // Reference for shaking effect
          sx={{
            borderRadius: '20px',
            backgroundColor: '#f0f0f0',
            '&:focus': {
              outline: 'none',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            ml: 1,
            backgroundColor: '#693bb8', // Set button background color to #693bb8
            '&:hover': {
              backgroundColor: '#5a2a9a', // Darker shade for hover effect
            },
          }}
        >
          Send
        </Button>
      </Box>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default ChatWindow;
