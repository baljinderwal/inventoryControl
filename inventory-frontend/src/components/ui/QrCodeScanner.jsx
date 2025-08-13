import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const QrCodeScanner = ({ onScanSuccess, onScanFailure, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-code-reader');
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanFailure
      ).catch(err => {
        console.error("Failed to start scanner", err);
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Failed to stop scanner", err);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <div id="qr-code-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
      <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
        Close Scanner
      </Button>
    </Box>
  );
};

export default QrCodeScanner;
