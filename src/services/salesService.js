import api from './api';

export const getSales = async () => {
  // For the sake of this example, we will fetch sales from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.sales || [];
};
