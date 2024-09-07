import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect personal information that you voluntarily provide to us when you use our services. This may include your name, email address, and other contact details."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to provide and improve our services, communicate with you, and comply with legal obligations."
    },
    {
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction or damage."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page."
    }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Privacy Policy
          </Typography>
        </motion.div>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                {section.title}
              </Typography>
              <Typography paragraph>
                {section.content}
              </Typography>
              {index < sections.length - 1 && <Divider sx={{ my: 3 }} />}
            </motion.div>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;