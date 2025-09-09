import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddEditPOForm from '../pages/orders/AddEditPOForm';
import { useNotification } from '../utils/NotificationContext';
import { supplierService } from '../services/supplierService';
import { stockService } from '../services/stockService';
import { poService } from '../services/poService';
import { vi } from 'vitest';

// Mock services and hooks
vi.mock('../utils/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));

vi.mock('../services/supplierService');
vi.mock('../services/stockService');
vi.mock('../services/poService');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockSuppliers = [
  { id: 1, name: 'Supplier A', products: [1, 2] },
  { id: 2, name: 'Supplier B', products: [3] },
];

const mockProducts = [
  { id: 1, name: 'Product A', stock: 10, sizeProfile: null },
  { id: 2, name: 'Product B (Adult)', stock: 5, sizeProfile: 'adult' },
  { id: 3, name: 'Product C', stock: 20, sizeProfile: null },
];

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('AddEditPOForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    supplierService.getSuppliers.mockResolvedValue(mockSuppliers);
    stockService.getStockLevels.mockResolvedValue(mockProducts);
    poService.addPO.mockResolvedValue({ id: 'po1' });
  });

  it('should add products with sizes when a product with a size profile is selected', async () => {
    render(
      <Wrapper>
        <AddEditPOForm open={true} onClose={() => {}} />
      </Wrapper>
    );

    // 1. Select a supplier
    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);

    await waitFor(async () => {
        const supplierOption = await screen.findByText('Supplier A');
        fireEvent.click(supplierOption);
    });

    // Check if product dropdown is enabled
    await waitFor(() => {
        const productSelect = screen.getAllByRole('combobox')[1];
        expect(productSelect).not.toBeDisabled();
    });

    // 2. Select the product with the size profile
    const productSelect = screen.getAllByRole('combobox')[1];
    fireEvent.mouseDown(productSelect);

    const productOption = await screen.findByText('Product B (Adult) (In Stock: 5)');
    fireEvent.click(productOption);

    // 3. Assert that the form has been updated with sizes
    await waitFor(async () => {
      const sizeInputs = await screen.findAllByLabelText('Size');
      expect(sizeInputs).toHaveLength(4);

      const quantityInputs = await screen.findAllByRole('spinbutton', { name: /quantity/i });
      expect(quantityInputs).toHaveLength(4);

      quantityInputs.forEach(input => {
        expect(input.value).toBe('1');
      });
    }, { timeout: 2000 });
  });
});
