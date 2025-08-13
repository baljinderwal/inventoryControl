import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocations, deleteLocation } from '../../services/locationsService';
import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditLocationForm from './AddEditLocationForm';
import { useNotification } from '../../utils/NotificationContext';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

const LocationsPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data: locations = [], isLoading, isError, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      showNotification('Location deleted successfully', 'success');
      setIsConfirmOpen(false);
      setSelectedLocation(null);
    },
    onError: (err) => {
      showNotification(`Error: ${err.message}`, 'error');
    },
  });

  const handleOpenModal = (location = null) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setIsModalOpen(false);
  };

  const handleOpenConfirm = (location) => {
    setSelectedLocation(location);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedLocation(null);
    setIsConfirmOpen(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedLocation.id);
  };

  const tableHeaders = ['Name', 'Address', 'Actions'];
  const tableData = locations.map(loc => ({
    name: loc.name,
    address: loc.address,
    actions: (
      <Box>
        <Button size="small" onClick={() => handleOpenModal(loc)}>Edit</Button>
        <Button size="small" color="error" onClick={() => handleOpenConfirm(loc)}>Delete</Button>
      </Box>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching locations: {error.message}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Locations</Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>Add Location</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedLocation ? 'Edit Location' : 'Add New Location'}
      >
        <AddEditLocationForm onClose={handleCloseModal} location={selectedLocation} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="Delete Location"
        description={`Are you sure you want to delete "${selectedLocation?.name}"? This action cannot be undone.`}
      />
    </Box>
  );
};

export default LocationsPage;
