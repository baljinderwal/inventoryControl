import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const StatsCard = ({ title, value, icon }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 20px -2px ${theme.palette.primary.main}40`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              mr: 2
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
