import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocations, addLocation, updateLocation, deleteLocation } from '../../services/locationService';

import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const LocationForm = ({ onClose, location, isEdit }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(location ? location.name : '');
  const [address, setAddress] = useState(location ? location.address : '');

  const addMutation = useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedLocation) => updateLocation(location.id, updatedLocation),
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationData = { name, address };
    if (isEdit) {
      updateMutation.mutate(locationData);
    } else {
      addMutation.mutate(locationData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={addMutation.isLoading || updateMutation.isLoading}>
        {isEdit ? 'Update' : 'Add'} Location
      </Button>
    </form>
  );
};

const LocationsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const { data: locations = [], isLoading, isError, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      setIsConfirmOpen(false);
    },
  });

  const handleOpenModal = (location = null) => {
    setSelectedLocation(location);
    setIsEdit(!!location);
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
    if (selectedLocation) {
      deleteMutation.mutate(selectedLocation.id);
    }
  };

  const tableHeaders = ['Name', 'Address', 'Actions'];

  const tableData = locations.map(loc => ({
    name: loc.name,
    address: loc.address,
    actions: (
      <>
        <IconButton onClick={() => handleOpenModal(loc)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleOpenConfirm(loc)}><DeleteIcon /></IconButton>
      </>
    ),
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Locations</Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>Add New Location</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEdit ? 'Edit Location' : 'Add New Location'}
      >
        <LocationForm onClose={handleCloseModal} location={selectedLocation} isEdit={isEdit} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="Delete Location"
        message={`Are you sure you want to delete ${selectedLocation?.name}?`}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default LocationsPage;
