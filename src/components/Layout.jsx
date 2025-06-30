import React from 'react';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflowX: 'hidden',
        // إزالة التقييدات السابقة التي كانت تحد من عرض المحتوى
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          position: 'relative',
          margin: 0,
          padding: 0,
          // transform: 'scale(.70)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default React.memo(Layout);