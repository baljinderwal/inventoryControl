import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import { useAuth } from '../../utils/AuthContext';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// Note: Add/Edit User form would be a separate component, not implemented here.

const UsersPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const { mode, services } = useApi();

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users', mode],
    queryFn: services.users.getUsers,
    enabled: user?.role === 'Admin', // Only run query if user is Admin
  });

  const deleteMutation = useMutation({
    mutationFn: services.users.deleteUser,
    onSuccess: (deletedUserId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showNotification('User deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting user: ${err.message}`, 'error');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>Unauthorized</Typography>
        <Typography>You do not have permission to view this page.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>User Management</Typography>
        <Button variant="contained" color="primary" disabled>
          Add User (Not Implemented)
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Failed to fetch users: {error.message}</Alert>}

      {!isLoading && !isError && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell align="right">
                    <IconButton disabled><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(u.id)} disabled={deleteMutation.isLoading}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UsersPage;
