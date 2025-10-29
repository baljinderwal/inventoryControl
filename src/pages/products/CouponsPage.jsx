import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import couponService from '../../services/couponService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import Paper from '@mui/material/Paper';

// A simple component to format the coupon for printing
const CouponToPrint = React.forwardRef(({ coupon }, ref) => (
  <div ref={ref} style={{ padding: '20px', textAlign: 'center' }}>
    <Typography variant="h4">Your Coupon</Typography>
    <Paper elevation={3} sx={{ p: 2, mt: 2, border: '2px dashed grey' }}>
      <Typography variant="h5">{coupon.code}</Typography>
      <Typography variant="h6">
        {coupon.discountType === 'percentage'
          ? `${coupon.discountValue}% OFF`
          : `$${coupon.discountValue} OFF`}
      </Typography>
    </Paper>
  </div>
));

const CouponsPage = ({ coupons }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const componentToPrintRef = useRef();

  const createCouponMutation = useMutation({
    mutationFn: couponService.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries('coupons');
      handleClose();
    },
  });

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDiscountType('percentage');
    setDiscountValue('');
  };

  const generateCouponCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleGenerateCoupon = () => {
    if (!discountValue || isNaN(discountValue)) {
      alert('Please enter a valid discount value.');
      return;
    }

    const newCoupon = {
      code: generateCouponCode(),
      discountType,
      discountValue: parseFloat(discountValue),
    };
    createCouponMutation.mutate(newCoupon);
  };

  const triggerPrint = (coupon) => {
    setSelectedCoupon(coupon);
    // The handlePrint function is called after the state update is rendered.
    // We use a timeout to ensure the component has re-rendered with the new selectedCoupon.
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Coupons</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Generate Coupon
        </Button>
      </Box>

      {coupons.length === 0 ? (
        <Typography variant="body2">No coupons generated yet.</Typography>
      ) : (
        <List>
          {coupons.map((coupon) => (
            <ListItem
              key={coupon.id}
              secondaryAction={
                <IconButton edge="end" aria-label="print" onClick={() => triggerPrint(coupon)}>
                  <PrintIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={coupon.code}
                secondary={
                  coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% off`
                    : `$${coupon.discountValue} off`
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Dialog for generating a new coupon */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Generate New Coupon</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="discount-type-label">Discount Type</InputLabel>
            <Select
              labelId="discount-type-label"
              value={discountType}
              label="Discount Type"
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Discount Value"
            type="number"
            fullWidth
            variant="outlined"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleGenerateCoupon}>Generate</Button>
        </DialogActions>
      </Dialog>

      {/* Hidden component for printing */}
      <div style={{ display: 'none' }}>
        {selectedCoupon && <CouponToPrint ref={componentToPrintRef} coupon={selectedCoupon} />}
      </div>
    </Box>
  );
};

export default CouponsPage;
