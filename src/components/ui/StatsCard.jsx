import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const StatsCard = ({ title, value, icon, trend, trendValue }) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (!trend) return theme.palette.text.secondary;
    return trend === 'up' ? theme.palette.success.main : theme.palette.error.main;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          borderColor: theme.palette.primary.main,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: trend ? 1 : 0,
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: getTrendColor(),
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25
                  }}
                >
                  <span style={{ fontSize: '1.1em' }}>{getTrendIcon()}</span>
                  {trendValue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: theme.palette.mode === 'dark' 
                ? `${theme.palette.primary.main}20` 
                : `${theme.palette.primary.main}15`,
              color: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: `0 8px 24px ${theme.palette.primary.main}25`,
              '& .MuiSvgIcon-root': {
                fontSize: '1.75rem'
              }
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
