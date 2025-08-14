// import api from './api';

export const getSuppliers = async () => {
  // const response = await api.get('/suppliers');
  // return response.data;

  // For the sake of this example, we will fetch products from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.suppliers || [];
};

export const addSupplier = async (supplier) => {
  // This is a read-only operation.
  console.log('Read-only mode: addSupplier disabled.', supplier);
  return Promise.resolve(supplier);
};

export const updateSupplier = async (id, supplier) => {
  // This is a read-only operation.
  console.log('Read-only mode: updateSupplier disabled.', id, supplier);
  return Promise.resolve(supplier);
};

export const deleteSupplier = async (id) => {
  // This is a read-only operation.
  console.log('Read-only mode: deleteSupplier disabled.', id);
  return Promise.resolve();
};
