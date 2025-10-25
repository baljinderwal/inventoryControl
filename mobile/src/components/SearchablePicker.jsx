import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SearchablePicker({ items = [], label, selectedId, onSelect, itemKey = 'id', itemLabel = 'name', placeholder = 'Search...' }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(i => (i[itemLabel] || '').toLowerCase().includes(q));
  }, [items, query, itemLabel]);

  return (
    <View style={styles.container}>
      <TextInput value={query} onChangeText={setQuery} placeholder={placeholder} style={styles.input} />
      {filtered.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>No results</Text></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i[itemKey]}
          renderItem={({ item }) => {
            const isSelected = selectedId === item[itemKey];
            return (
              <TouchableOpacity onPress={() => onSelect(item[itemKey])} style={[styles.item, isSelected && styles.itemSelected]}>
                <Text style={isSelected ? styles.itemTextSelected : styles.itemText}>{item[itemLabel]}</Text>
              </TouchableOpacity>
            );
          }}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  list: { maxHeight: 160 },
  item: { padding: 10, borderRadius: 8, backgroundColor: '#f2f2f2', marginBottom: 6 },
  itemSelected: { backgroundColor: '#1976d2' },
  itemText: { color: '#222' },
  itemTextSelected: { color: '#fff' },
});
