import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import MuiTable from '../../components/ui/Table';
import { locationService } from '../../services/locationService';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const LocationsPage = () => {
  const { mode } = useApi();
  // We need to extend useApi to include locationService
  const services = { ...useApi().services, locations: locationService[mode] };

  const { data: locations = [], isLoading, isError, error } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => services.locations.getLocations(),
  });

  const tableHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'address', label: 'Address' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = locations.map(location => ({
    id: location.id,
    name: location.name,
    address: location.address,
    actions: (
      <Box>
        <IconButton onClick={() => console.log('edit', location)}><EditIcon /></IconButton>
        <IconButton onClick={() => console.log('delete', location)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching locations: {error.message}</Alert>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Locations</Typography>
        <Button variant="contained" onClick={() => console.log('add')}>Add Location</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />
    </div>
  );
};

export default LocationsPage;
