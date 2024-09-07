import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, IconButton, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const changeMonth = (amount) => {
    setCurrentDate(prevDate => amount > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1));
  };

  const getDaysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderDays = useMemo(() => {
    const days = getDaysInMonth;
    const firstDayOfMonth = getDay(days[0]);
    const daysArray = Array(firstDayOfMonth).fill(null).concat(days);

    return daysArray.map((day, index) => (
      <Grid item xs={1.7} key={day ? day.toString() : `empty-${index}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Paper
            elevation={3}
            sx={{
              height: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: day ? 'pointer' : 'default',
              bgcolor: day ? (isToday(day) ? '#4caf50' : isSameMonth(day, currentDate) ? '#ffffff' : '#f5f5f5') : 'transparent',
              color: day ? (isToday(day) ? '#ffffff' : isSameMonth(day, currentDate) ? '#000000' : '#bdbdbd') : 'transparent',
              border: selectedDate && day && day.toDateString() === selectedDate.toDateString() ? '2px solid #2196f3' : 'none',
              transition: 'all 0.3s ease',
            }}
            onClick={() => day && handleDateClick(day)}
          >
            <Typography variant="body2">
              {day ? format(day, 'd') : ''}
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    ));
  }, [currentDate, selectedDate, getDaysInMonth]);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3, marginTop: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <IconButton onClick={() => changeMonth(-1)}>
            <ArrowBackIos />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={() => changeMonth(1)}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.toString()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={1}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Grid item xs={1.7} key={day}>
                <Typography variant="subtitle2" align="center" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {day}
                </Typography>
              </Grid>
            ))}
            {renderDays}
          </Grid>
        </motion.div>
      </AnimatePresence>
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" sx={{ marginTop: 2, textAlign: 'center' }}>
            Selected Date: {format(selectedDate, 'PPP')}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default Calendar;