import React from 'react';
import { useApi } from '../../utils/ApiModeContext';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ApiModeToggle = () => {
  const { mode, toggleMode } = useApi();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
      <Typography variant="caption" sx={{ mr: 1 }}>
        API Mode:
      </Typography>
      <FormControlLabel
        control={<Switch checked={mode === 'api'} onChange={toggleMode} />}
        label={mode === 'api' ? 'Live' : 'Local'}
        sx={{ m: 0 }}
      />
    </Box>
  );
};

export default ApiModeToggle;
