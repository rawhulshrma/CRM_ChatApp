import React, { useState } from 'react';
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    { question: "What services do you offer?", answer: "We offer a wide range of digital services including web development, mobile app development, and digital marketing solutions." },
    { question: "How can I contact customer support?", answer: "You can reach our customer support team via email at support@example.com or by phone at +1 (123) 456-7890." },
    { question: "What are your business hours?", answer: "Our business hours are Monday to Friday, 9:00 AM to 5:00 PM (EST). We are closed on weekends and major holidays." },
    { question: "Do you offer refunds?", answer: "Yes, we offer refunds within 30 days of purchase if you're not satisfied with our services. Please refer to our refund policy for more details." },
    { question: "How long does it take to complete a project?", answer: "Project timelines vary depending on the scope and complexity of the work. We provide estimated completion times during our initial consultation." }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Frequently Asked Questions
        </Typography>
        <Paper elevation={3} sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default FAQ;
