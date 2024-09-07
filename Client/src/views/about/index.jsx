import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Avatar, IconButton, Tooltip } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaUserTie, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = ({ name, email, role, image, linkedIn, github, twitter }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(containerRef.current, { opacity: 0, duration: 1 })
      .from(detailsRef.current.children, { 
        x: -100, 
        opacity: 0, 
        stagger: 0.2, 
        ease: "power3.out" 
      })
      .from(imageRef.current, { 
        scale: 0, 
        opacity: 0, 
        rotation: -360, 
        duration: 1.5, 
        ease: "elastic.out(1, 0.3)" 
      }, "-=0.5");

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      onEnter: () => controls.start({ opacity: 1, y: 0 }),
      onLeave: () => controls.start({ opacity: 0, y: 50 }),
      onEnterBack: () => controls.start({ opacity: 1, y: 0 }),
      onLeaveBack: () => controls.start({ opacity: 0, y: 50 }),
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [controls]);

  const handleHover = (hovered) => {
    gsap.to(imageRef.current, {
      scale: hovered ? 1.1 : 1,
      rotation: hovered ? 10 : 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <Box ref={containerRef} sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: 4
    }}>
      <Grid container spacing={4} sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Grid item xs={12} md={6} ref={detailsRef}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={controls}>
            <Typography variant="h2" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#2c3e50' }}>
              {name}
            </Typography>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, color: '#34495e' }}>
              <FaEnvelope style={{ marginRight: 8 }} /> {email}
            </Typography>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#34495e' }}>
              <FaUserTie style={{ marginRight: 8 }} /> {role}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
              <Tooltip title="LinkedIn">
                <IconButton component="a" href={linkedIn} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip title="GitHub">
                <IconButton component="a" href={github} target="_blank" rel="noopener noreferrer">
                  <FaGithub size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter">
                <IconButton component="a" href={twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            ref={imageRef}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={controls}
          >
            <Avatar
              src={image}
              alt={name}
              sx={{
                width: 300,
                height: 300,
                boxShadow: '0px 0px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease-in-out',
              }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;
