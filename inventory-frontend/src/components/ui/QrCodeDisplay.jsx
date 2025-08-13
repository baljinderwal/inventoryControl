import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const QrCodeDisplay = ({ value }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
    const svgElement = document.getElementById('qr-code-svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      printWindow.document.write(svgString);
    }
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        QR Code for: {value}
      </Typography>
      <QRCodeSVG value={value} size={256} id="qr-code-svg" />
      <Box sx={{ mt: 2 }}>
        <Button onClick={handlePrint} variant="contained">
          Print QR Code
        </Button>
      </Box>
    </Box>
  );
};

export default QrCodeDisplay;
