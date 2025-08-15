import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box
} from '@mui/material';

import StatsCard from '../../components/ui/StatsCard';
import Typography from '@mui/material/Typography';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LowStockWidget from '../../components/dashboard/LowStockWidget';
import InventoryTrendsWidget from '../../components/dashboard/InventoryTrendsWidget';
import RecentSalesWidget from '../../components/dashboard/RecentSalesWidget';
import TopCustomersWidget from '../../components/dashboard/TopCustomersWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const chartData = [
  { name: 'Jan', Sales: 4000, Stock: 2400 },
  { name: 'Feb', Sales: 3000, Stock: 1398 },
  { name: 'Mar', Sales: 2000, Stock: 9800 },
  { name: 'Apr', Sales: 2780, Stock: 3908 },
  { name: 'May', Sales: 1890, Stock: 4800 },
  { name: 'Jun', Sales: 2390, Stock: 3800 },
];

const DashboardPage = () => {
  const { mode, services } = useApi();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['stock', mode],
    queryFn: services.stock.getStockLevels,
  });

  const lowStockProducts = products?.filter(p => p.stock <= p.lowStockThreshold) || [];

  const stats = [
    { name: 'Total Products', stat: products?.length || 0, icon: <InventoryIcon /> },
    { name: 'Total Orders', stat: '2,310', icon: <ShoppingCartIcon /> },
    { name: 'Low Stock', stat: lowStockProducts.length, icon: <WarningIcon /> },
    { name: 'Revenue', stat: '$405,091', icon: <AttachMoneyIcon /> },
  ];

  const originalLayouts = {
    lg: [
        { i: 'a', x: 0, y: 0, w: 3, h: 2 },
        { i: 'b', x: 3, y: 0, w: 3, h: 2 },
        { i: 'c', x: 6, y: 0, w: 3, h: 2 },
        { i: 'd', x: 9, y: 0, w: 3, h: 2 },
        { i: 'e', x: 0, y: 2, w: 6, h: 5 },
        { i: 'f', x: 6, y: 2, w: 6, h: 5 },
        { i: 'g', x: 0, y: 7, w: 6, h: 5 },
        { i: 'h', x: 6, y: 7, w: 6, h: 5 },
    ],
    md: [
        { i: 'a', x: 0, y: 0, w: 5, h: 2 },
        { i: 'b', x: 5, y: 0, w: 5, h: 2 },
        { i: 'c', x: 0, y: 2, w: 5, h: 2 },
        { i: 'd', x: 5, y: 2, w: 5, h: 2 },
        { i: 'e', x: 0, y: 4, w: 10, h: 5 },
        { i: 'f', x: 0, y: 9, w: 10, h: 5 },
        { i: 'g', x: 0, y: 14, w: 10, h: 5 },
        { i: 'h', x: 0, y: 19, w: 10, h: 5 },
    ]
  };

  const [layouts, setLayouts] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLayouts = localStorage.getItem('dashboard-layouts');
      return savedLayouts ? JSON.parse(savedLayouts) : originalLayouts;
    }
    return originalLayouts;
  });

  const onLayoutChange = (layout, newLayouts) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts));
    }
    setLayouts(newLayouts);
  };

  const allWidgets = [
    { id: 'a', name: 'Total Products' },
    { id: 'b', name: 'Total Orders' },
    { id: 'c', name: 'Low Stock' },
    { id: 'd', name: 'Revenue' },
    { id: 'e', name: 'Low Stock Alerts' },
    { id: 'f', name: 'Inventory Trends' },
    { id: 'g', name: 'Recent Sales' },
    { id: 'h', name: 'Top Customers' },
  ];

  const [widgets, setWidgets] = useState(() => {
    if (typeof window !== 'undefined') {
        const savedWidgets = localStorage.getItem('dashboard-widgets');
        return savedWidgets ? JSON.parse(savedWidgets) : allWidgets.map(w => w.id);
    }
    return allWidgets.map(w => w.id);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWidgetChange = (event) => {
    const { name, checked } = event.target;
    setWidgets(prev => {
        const newWidgets = checked ? [...prev, name] : prev.filter(w => w !== name);
        if (typeof window !== 'undefined') {
            localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
        }
        return newWidgets;
    });
  };

  return (
    <div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Button variant="outlined" onClick={() => setIsModalOpen(true)}>Customize</Button>
        </Box>
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}>
            {widgets.includes('a') && <div key="a"><StatsCard title={stats[0].name} value={stats[0].stat} icon={stats[0].icon} /></div>}
            {widgets.includes('b') && <div key="b"><StatsCard title={stats[1].name} value={stats[1].stat} icon={stats[1].icon} /></div>}
            {widgets.includes('c') && <div key="c"><StatsCard title={stats[2].name} value={stats[2].stat} icon={stats[2].icon} /></div>}
            {widgets.includes('d') && <div key="d"><StatsCard title={stats[3].name} value={stats[3].stat} icon={stats[3].icon} /></div>}
            {widgets.includes('e') && <div key="e"><LowStockWidget /></div>}
            {widgets.includes('f') && <div key="f"><InventoryTrendsWidget /></div>}
            {widgets.includes('g') && <div key="g"><RecentSalesWidget /></div>}
            {widgets.includes('h') && <div key="h"><TopCustomersWidget /></div>}
        </ResponsiveGridLayout>
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogContent>
                <FormGroup>
                    {allWidgets.map(widget => (
                        <FormControlLabel
                            key={widget.id}
                            control={<Checkbox checked={widgets.includes(widget.id)} onChange={handleWidgetChange} name={widget.id} />}
                            label={widget.name}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

export default DashboardPage;
