import { v4 as uuidv4 } from 'uuid';

export const generateBarcode = () => {
  const uuid = uuidv4();
  // A common barcode format is EAN-13, which has 13 digits.
  // We can derive a numeric string from the UUID.
  // This is a simple example. For a real application, you might need a more robust method
  // that guarantees uniqueness and adheres to a specific barcode standard.
  const numericString = uuid.replace(/[^0-9]/g, '');
  return numericString.substring(0, 12); // Taking first 12 for EAN-13, checksum can be added by barcode libs
};
