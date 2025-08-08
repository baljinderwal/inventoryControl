import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Product Data:', formData);
    onClose(); // Close the modal after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
        <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
          Cancel
        </Button>
        <Button type="submit">
          Add Product
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
