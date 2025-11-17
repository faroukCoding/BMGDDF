import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/api';
import { colors } from '../../theme/colors';

const DriverDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/orders/driver');
      setOrders(data);
    } catch (error) {
      Alert.alert(t('errorTitle'), t('fetchOrdersFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDriverOrders);
    return unsubscribe;
  }, [navigation]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
        await apiClient.put(`/orders/${orderId}/status`, { status });
        Alert.alert(t('successTitle'), 'Order status updated!');
        fetchDriverOrders(); // Refresh list
    } catch (error) {
        Alert.alert(t('errorTitle'), 'Failed to update status.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.customer_name}</Text>
      <Text style={styles.itemSubText}>{item.customer_address}</Text>
      <Text style={styles.itemSubText}>{item.customer_phone}</Text>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#27ae60'}]} onPress={() => handleUpdateStatus(item.id, 'delivered')}>
          <Text style={styles.buttonText}>✅ {t('delivered')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#c0392b'}]} onPress={() => handleUpdateStatus(item.id, 'failed_delivery')}>
          <Text style={styles.buttonText}>❌ {t('failed_delivery')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('driverDashboard')}</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('noAssignedOrders')}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 10 },
    title: { fontSize: 24, color: colors.secondary, marginBottom: 20, textAlign: 'center' },
    itemContainer: { backgroundColor: '#2C2C54', padding: 15, borderRadius: 8, marginBottom: 10 },
    itemTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
    itemSubText: { color: colors.secondary, fontSize: 16, marginVertical: 5 },
    productInfo: { borderTopWidth: 1, borderTopColor: '#444', marginTop: 10, paddingTop: 10 },
    productName: { color: colors.white, fontSize: 16, textAlign: 'center' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
    actionButton: { padding: 15, borderRadius: 8, width: '48%', alignItems: 'center' },
    buttonText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
    emptyText: { color: colors.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 },
});

export default DriverDashboard;
