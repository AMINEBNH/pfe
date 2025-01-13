// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        textAlign: 'center',
        borderTop: '1px solid #ccc',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2023 - Mon Application. Tous droits réservés.
      </Typography>
    </Box>
  );
};

export default Footer;
