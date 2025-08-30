import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';
import { useNavigate, Link } from 'react-router-dom';

import MuiTable from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditProductForm from './AddEditProductForm';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['stock', mode], // Refetch when mode changes
    queryFn: services.stock.getStockLevels,
  });

  const deleteMutation = useMutation({
    mutationFn: services.products.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Just in case
      showNotification('Product deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting product: ${err.message}`, 'error');
    },
  });

  const { categories, suppliers } = useMemo(() => {
    if (!Array.isArray(products)) return { categories: [], suppliers: [] };
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    const uniqueSuppliers = [...new Set(products.map(p => p.supplierName).filter(Boolean))];
    return {
      categories: ['All', ...uniqueCategories],
      suppliers: ['All', ...uniqueSuppliers],
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((product) => {
      // Search query filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;

      // Stock status filter
      let matchesStockStatus = true;
      if (stockStatusFilter !== 'All') {
        if (stockStatusFilter === 'In Stock') {
          matchesStockStatus = product.stock > product.lowStockThreshold;
        } else if (stockStatusFilter === 'Low Stock') {
          matchesStockStatus = product.stock > 0 && product.stock <= product.lowStockThreshold;
        } else if (stockStatusFilter === 'Out of Stock') {
          matchesStockStatus = product.stock === 0;
        }
      }

      // Supplier filter
      const matchesSupplier = supplierFilter === 'All' || product.supplierName === supplierFilter;

      return matchesSearch && matchesCategory && matchesStockStatus && matchesSupplier;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter, supplierFilter]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortColumn) {
      sorted.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredProducts, sortColumn, sortDirection]);

  const handleExport = () => {
    if (!filteredProducts) return;
    const fields = ['id', 'name', 'sku', 'barcode', 'category', 'price', 'costPrice', 'stock', 'lowStockThreshold', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  }

  const tableHeaders = [
    { id: 'image', label: 'Image', isSortable: false },
    { id: 'name', label: 'Name', isSortable: true },
    { id: 'sku', label: 'SKU', isSortable: true },
    { id: 'category', label: 'Category', isSortable: true },
    { id: 'price', label: 'Price', isSortable: true },
    { id: 'stock', label: 'Stock', isSortable: true },
    { id: 'supplierName', label: 'Supplier', isSortable: true },
    { id: 'actions', label: 'Actions', isSortable: false },
  ];

  const StockStatusIndicator = ({ product }) => {
    let color;
    let statusText;
    if (product.stock === 0) {
      color = 'error';
      statusText = 'Out of Stock';
    } else if (product.stock > 0 && product.stock <= product.lowStockThreshold) {
      color = 'warning';
      statusText = 'Low Stock';
    } else {
      color = 'success';
      statusText = 'In Stock';
    }
    return (
      <Tooltip title={statusText}>
        <FiberManualRecordIcon 
          sx={{ 
            fontSize: 14, 
            mr: 1,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
            transition: 'all 0.2s ease'
          }} 
          color={color} 
        />
      </Tooltip>
    );
  };

  const tableData = sortedProducts.map(p => ({
    id: p.id, // for key
    image: p.imageUrl ? (
      <img src={p.imageUrl} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
    ) : (
      <Box sx={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
    ),
    name: (
      <Link to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {p.name}
      </Link>
    ),
    sku: p.sku,
    category: p.category,
    price: `$${p.price.toFixed(2)}`,
    stock: (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StockStatusIndicator product={p} />
        {p.stock}
      </Box>
    ),
    supplierName: p.supplierName,
    actions: (
      <Box>
        <IconButton onClick={() => handleEditClick(p)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDeleteClick(p)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching products: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/products/import')}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!filteredProducts || filteredProducts.length === 0}
          >
            Export
          </Button>
          <Button variant="contained" onClick={handleAddClick}>Add Product</Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="category-filter"
              >
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockStatusFilter}
                label="Stock Status"
                onChange={(e) => setStockStatusFilter(e.target.value)}
                data-testid="stock-status-filter"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
             <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={supplierFilter}
                label="Supplier"
                onChange={(e) => setSupplierFilter(e.target.value)}
                data-testid="supplier-filter"
              >
                {suppliers.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <MuiTable
        headers={tableHeaders}
        data={tableData}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      <AppDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        title={productToEdit ? 'Edit Product' : 'Add New Product'}
      >
        <AddEditProductForm onClose={handleCloseForm} product={productToEdit} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${productToDelete?.name}?`}
      />
    </div>
  );
};

export default ProductsPage;
