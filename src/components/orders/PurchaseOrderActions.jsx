import React from 'react';
import { Button, Stack } from '@mui/material';
import { Add, Download } from '@mui/icons-material';

const PurchaseOrderActions = ({ onExport, onNewPO, isExportDisabled }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={onExport}
        disabled={isExportDisabled}
      >
        Export as CSV
      </Button>
      <Button variant="contained" startIcon={<Add />} onClick={onNewPO}>
        New PO
      </Button>
    </Stack>
  );
};

export default PurchaseOrderActions;
