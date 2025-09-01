import { v4 as uuidv4 } from 'uuid';

export const generateSku = () => {
  const uuid = uuidv4().toUpperCase();
  return `SKU-${uuid.substring(0, 8)}`;
};
