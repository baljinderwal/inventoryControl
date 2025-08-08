import React, { useState, useMemo } from 'react';
import MuiTable from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import Button from '@mui/material/Button';
import Modal from '../../components/ui/Modal';
import AddProductForm from './AddProductForm';
import { products as initialProducts } from '../../utils/dummyData';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Products
        </Typography>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <MuiTable headers={tableHeaders} data={filteredProducts} />

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
