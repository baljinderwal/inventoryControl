import React from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useZxing } from 'react-zxing';

const BarcodeScanner = ({ onScan }) => {
  const { ref } = useZxing({
    onDecodeResult: (result) => {
      onScan(result.getText());
    },
  });

  return <video ref={ref} />;
};

export default BarcodeScanner;
