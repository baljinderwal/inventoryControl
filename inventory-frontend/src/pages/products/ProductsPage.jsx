import React, { useState, useMemo } from 'react';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AddProductForm from './AddProductForm';
import { products as initialProducts } from '../../utils/dummyData';

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const tableHeaders = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Products</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table headers={tableHeaders} data={filteredProducts} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <AddProductForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProductsPage;
