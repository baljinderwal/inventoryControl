import React from 'react';
import { Button, Stack } from '@mui/material';
import { Add, Download } from '@mui/icons-material';

/**
 * Renders the action buttons for the Purchase Orders page.
 * @param {object} props - The component props.
 * @param {function} props.onExport - The function to call when the export button is clicked.
 * @param {function} props.onNewPO - The function to call when the new PO button is clicked.
 * @param {boolean} props.isExportDisabled - Whether the export button should be disabled.
 */
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
