import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="fixed" // ✅ Stay fixed at top
      sx={{
        backgroundColor: 'black',
        width: '100vw',            // ✅ Full screen width
        left: 0,
        top: 0,
        margin: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it stays above sidebar
      }}


    >
      <Toolbar>
        <Typography variant="h6" component="div">
          Jacked
        </Typography>
      </Toolbar>
    </AppBar>
  );




};

export default Header;
