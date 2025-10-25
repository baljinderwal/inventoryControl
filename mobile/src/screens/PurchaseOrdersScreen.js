import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const fetchOrders = async () => {
  const res = await api.get('/orders?_expand=supplier');
  return res.data;
};

export default function PurchaseOrdersScreen({ navigation }) {
  const { data, isLoading, error, refetch } = useQuery(['orders'], fetchOrders);

  if (isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text>Error fetching orders</Text></View>;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}>
        <Button title="Create PO" onPress={() => navigation.navigate('AddPO')} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>PO #{item.id} - {item.supplier?.name || 'N/A'}</Text>
            <Text>Items: {item.products?.length || 0}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Button title="Refresh" onPress={() => refetch()} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontWeight: '700' },
  header: { padding: 12 }
});
