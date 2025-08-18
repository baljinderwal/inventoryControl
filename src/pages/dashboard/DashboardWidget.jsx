import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DashboardWidget = ({ title, children, dragHandleProps }) => {
  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ flexGrow: 1, mb: 0 }}>
          {title}
        </Typography>
        <Box {...dragHandleProps} sx={{ cursor: 'grab' }}>
          <DragIndicatorIcon sx={{ color: 'text.disabled' }} />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DashboardWidget;
