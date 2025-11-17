import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import apiClient from '../../services/api';

const ProductListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [navigation]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/products');
      setProducts(data);
    } catch (error) {
      Alert.alert(t('errorTitle'), t('fetchProductsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      t('confirmDeleteTitle'),
      t('confirmDeleteMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => deleteProduct(id) },
      ]
    );
  };

  const deleteProduct = async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
      fetchProducts(); // Refresh list
    } catch (error) {
      Alert.alert(t('errorTitle'), t('deleteProductFailed'));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price} (Com: ${item.commission})</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProductEdit', { product: item })}>
          <Text style={styles.buttonText}>{t('edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('manageProducts')}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductEdit', { product: null })}>
        <Text style={styles.addButtonText}>➕ {t('addNewProduct')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 10 },
    title: { fontSize: 24, color: colors.secondary, marginBottom: 20, textAlign: 'center' },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2C2C54', padding: 15, borderRadius: 8, marginBottom: 10 },
    itemDetails: { flex: 1 },
    itemName: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    itemPrice: { color: colors.secondary, fontSize: 14, marginTop: 5 },
    itemActions: { flexDirection: 'row' },
    editButton: { backgroundColor: '#3498db', padding: 10, borderRadius: 5, marginRight: 10 },
    deleteButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5 },
    buttonText: { color: colors.white, fontSize: 14 },
    addButton: { backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: 'center', margin: 10 },
    addButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default ProductListScreen;
