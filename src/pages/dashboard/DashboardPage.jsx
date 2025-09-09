import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNotificationCenter } from '../../utils/NotificationCenterContext';
import { stockService } from '../../services/stockService';
import StatsCard from '../../components/ui/StatsCard';
import DashboardWidget from './DashboardWidget';
import AppDialog from '../../components/ui/AppDialog';
import { Button, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

const chartData = [
  { name: 'Jan', Sales: 4000, Stock: 2400 },
  { name: 'Feb', Sales: 3000, Stock: 1398 },
  { name: 'Mar', Sales: 2000, Stock: 9800 },
  { name: 'Apr', Sales: 2780, Stock: 3908 },
  { name: 'May', Sales: 1890, Stock: 4800 },
  { name: 'Jun', Sales: 2390, Stock: 3800 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const SortableWidget = ({ id, widget, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Grid item {...widget.gridProps} ref={setNodeRef} style={style} component={motion.div} variants={itemVariants}>
            <DashboardWidget title={widget.title} dragHandleProps={{...attributes, ...listeners}}>
                {children}
            </DashboardWidget>
        </Grid>
    );
};

const DashboardPage = () => {
  const { addNotification, notifications } = useNotificationCenter();
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['stock'],
    queryFn: stockService.getStockLevels,
  });

  const lowStockProducts = useMemo(() => {
    return products?.filter(p => p.stock <= p.lowStockThreshold) || [];
  }, [products]);

  useEffect(() => {
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        const notificationExists = notifications.some(
          n => n.type === 'LOW_STOCK' && n.refId === product.id
        );
        if (!notificationExists) {
          addNotification({
            message: `${product.name} is low on stock! Only ${product.stock} left.`,
            type: 'LOW_STOCK',
            refId: product.id
          });
        }
      });
    }
  }, [lowStockProducts, addNotification, notifications]);

  useEffect(() => {
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        const notificationExists = notifications.some(
          n => n.type === 'LOW_STOCK' && n.refId === product.id
        );
        if (!notificationExists) {
          addNotification({
            message: `${product.name} is low on stock! Only ${product.stock} left.`,
            type: 'LOW_STOCK',
            refId: product.id
          });
        }
      });
    }
  }, [lowStockProducts, addNotification, notifications]);

  const stats = useMemo(() => [
    { 
      name: 'Total Products', 
      stat: products?.length || 0, 
      icon: <InventoryIcon />,
      trend: 'up',
      trendValue: '+12%'
    },
    { 
      name: 'Total Orders', 
      stat: '2,310', 
      icon: <ShoppingCartIcon />,
      trend: 'up',
      trendValue: '+8.2%'
    },
    { 
      name: 'Low Stock', 
      stat: lowStockProducts.length, 
      icon: <WarningIcon />,
      trend: lowStockProducts.length > 5 ? 'up' : 'down',
      trendValue: lowStockProducts.length > 5 ? '+15%' : '-5%'
    },
    { 
      name: 'Revenue', 
      stat: '$405,091', 
      icon: <AttachMoneyIcon />,
      trend: 'up',
      trendValue: '+23.1%'
    },
  ], [products, lowStockProducts]);

  const [layout, setLayout] = useState([
    { id: 'stats', title: 'Key Metrics', visible: true, component: 'stats', gridProps: { xs: 12 } },
    { id: 'lowStock', title: 'Low Stock Alerts', visible: true, component: 'lowStock', gridProps: { xs: 12, md: 6 } },
    { id: 'trends', title: 'Inventory Trends', visible: true, component: 'trends', gridProps: { xs: 12, md: 6 } },
  ]);

  const widgets = useMemo(() => ({
    stats: (
        <Grid container spacing={3}>
            {stats.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.name}>
                <StatsCard 
                  title={item.name} 
                  value={item.stat} 
                  icon={item.icon}
                  trend={item.trend}
                  trendValue={item.trendValue}
                />
              </Grid>
            ))}
        </Grid>
    ),
    lowStock: (
        <>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Error fetching products.</Typography>
        ) : lowStockProducts.length > 0 ? (
          <List>
            {lowStockProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText
                  primary={product.name}
                  secondary={`Current Stock: ${product.stock} | Threshold: ${product.lowStockThreshold}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No products are currently low on stock. Great job!</Typography>
        )}
        </>
    ),
    trends: (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
            <Legend />
            <Bar dataKey="Stock" fill="#6366f1" />
            <Bar dataKey="Sales" fill="#ec4899" />
            </BarChart>
        </ResponsiveContainer>
    )
  }), [stats, isLoading, error, lowStockProducts]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleVisibilityChange = (id) => {
    setLayout(prevLayout =>
      prevLayout.map(widget =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="outlined" onClick={() => setIsCustomizeDialogOpen(true)}>
            Customize
        </Button>
      </Box>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout.map(w => w.id)} strategy={verticalListSortingStrategy}>
            <Grid container spacing={3}>
                {layout.filter(w => w.visible).map(widget => (
                    <SortableWidget key={widget.id} id={widget.id} widget={widget}>
                        {widgets[widget.component]}
                    </SortableWidget>
                ))}
            </Grid>
        </SortableContext>
      </DndContext>

      <AppDialog open={isCustomizeDialogOpen} onClose={() => setIsCustomizeDialogOpen(false)} title="Customize Dashboard Widgets">
          <FormGroup>
              {layout.map((widget) => (
                  <FormControlLabel
                    key={widget.id}
                    control={
                        <Checkbox
                            checked={widget.visible}
                            onChange={() => handleVisibilityChange(widget.id)}
                            name={widget.id}
                        />
                    }
                    label={widget.title}
                  />
              ))}
          </FormGroup>
      </AppDialog>
    </motion.div>
  );
};

export default DashboardPage;
