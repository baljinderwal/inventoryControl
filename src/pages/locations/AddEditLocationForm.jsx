import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLocation, updateLocation } from '../../services/locationsService';
import { useNotification } from '../../utils/NotificationContext';
import { Box, TextField, Button, DialogActions } from '@mui/material';

const AddEditLocationForm = ({ onClose, location }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return location ? updateLocation(location.id, data) : addLocation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      showNotification(`Location ${location ? 'updated' : 'added'} successfully`, 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error: ${err.message}`, 'error');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Location name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Location Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
            autoFocus
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        rules={{ required: 'Address is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address"
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        )}
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {location ? 'Update' : 'Add'} Location
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditLocationForm;
