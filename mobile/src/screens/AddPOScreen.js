import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers } from '../services/supplierService';
import { getStock } from '../services/stockService';
import { addPO } from '../services/poService';
import SearchablePicker from '../components/SearchablePicker';

export default function AddPOScreen({ navigation }) {
  const [supplierId, setSupplierId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  // sizesQuantities: { sizeName: qty }
  const [sizesQuantities, setSizesQuantities] = useState({});
  // optional batch selection (batch id)
  const [batchId, setBatchId] = useState(null);
  const queryClient = useQueryClient();

  const { data: suppliers, isLoading: loadingSuppliers } = useQuery(['suppliers'], () => getSuppliers());
  const { data: products, isLoading: loadingProducts } = useQuery(['stock'], () => getStock());

  const supplierList = suppliers || [];
  const productList = products || [];

  const filteredProducts = useMemo(() => {
    if (!supplierId) return productList;
    // include products that have batches supplied by this supplier
    return productList.filter(p => p.batches?.some(b => b.supplierId === supplierId));
  }, [productList, supplierId]);

  const mutation = useMutation((po) => addPO(po), {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      Alert.alert('Success', 'PO created');
      navigation.goBack();
    },
    onError: (e) => Alert.alert('Error', e.message || 'Failed to create PO'),
  });

  const handleCreate = () => {
    if (!supplierId) return Alert.alert('Validation', 'Please select a supplier');
    if (!productId) return Alert.alert('Validation', 'Please select a product');
    // If sizes provided, ensure at least one size qty > 0
    let productsPayload = [];
    if (selectedProduct && selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      const sizes = Object.entries(sizesQuantities).map(([size, q]) => ({ size, quantity: Number(q) || 0 }));
      const totalQty = sizes.reduce((s, it) => s + (it.quantity || 0), 0);
      if (totalQty <= 0) return Alert.alert('Validation', 'Enter quantity for at least one size');
      productsPayload.push({ productId, sizes });
    } else {
      const qty = Number(quantity);
      if (!qty || qty <= 0) return Alert.alert('Validation', 'Quantity must be > 0');
      productsPayload.push({ productId, quantity: qty });
    }

    const po = {
      supplierId,
      supplier: { id: supplierId, name: supplierList.find(s => s.id === supplierId)?.name || 'Supplier' },
      status: 'Pending',
      products: productsPayload,
      batchId: batchId || null,
      createdAt: new Date().toISOString(),
    };
    mutation.mutate(po);
  };

  if (loadingSuppliers || loadingProducts) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;

  const selectedProduct = productList.find(p => p.id === productId) || null;

  const handleSizeQtyChange = (size, val) => {
    const q = Number(val) || 0;
    setSizesQuantities(prev => ({ ...prev, [size]: q }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Supplier</Text>
      {supplierList.length === 0 ? <Text style={styles.emptyText}>No suppliers available</Text> : <SearchablePicker items={supplierList} selectedId={supplierId} onSelect={(id) => { setSupplierId(id); setProductId(''); setBatchId(null); setSizesQuantities({}); }} />}

      <Text style={styles.label}>Product (from supplier batches)</Text>
  {filteredProducts.length === 0 ? <Text style={styles.emptyText}>No products for this supplier</Text> : <SearchablePicker items={filteredProducts} selectedId={productId} onSelect={(id) => { setProductId(id); setSizesQuantities({}); setBatchId(null); }} />}

      {selectedProduct && (
        <View>
          <Text style={[styles.label, { marginTop: 10 }]}>Available batches</Text>
          <FlatList
            data={selectedProduct.batches || []}
            keyExtractor={b => b.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setBatchId(item.id)} style={[styles.chip, batchId === item.id && styles.chipSelected]}>
                <Text style={batchId === item.id ? styles.chipTextSelected : styles.chipText}>{`${item.id} (${item.supplierId})`}</Text>
              </TouchableOpacity>
            )}
          />

          {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
            <View>
              <Text style={[styles.label, { marginTop: 10 }]}>Sizes (enter quantity per size)</Text>
              {selectedProduct.sizes.map(size => (
                <View key={size} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ width: 80 }}>{size}</Text>
                  <TextInput style={[styles.input, { flex: 1 }]} keyboardType="numeric" value={(sizesQuantities[size] || '').toString()} onChangeText={(v) => handleSizeQtyChange(size, v)} />
                </View>
              ))}
            </View>
          ) : (
            <>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            </>
          )}
        </View>
      )}

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Cancel" color="#777" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title={mutation.isLoading ? 'Creating...' : 'Create PO'} onPress={handleCreate} disabled={mutation.isLoading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginTop: 6 },
  chip: { padding: 8, backgroundColor: '#f2f2f2', marginRight: 8, borderRadius: 20 },
  chipSelected: { backgroundColor: '#1976d2' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff' },
  emptyText: { color: '#666', marginVertical: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  buttonWrapper: { flex: 1, marginHorizontal: 6 },
});
