import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import { colors } from '../theme/colors';

const OrderList = ({ status, navigation }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const url = status ? `/orders?status=${status}` : '/orders'; // Simplified logic
        const { data } = await apiClient.get(url);
        setOrders(data);
      } catch (error) {
        Alert.alert(t('errorTitle'), t('fetchOrdersFailed'));
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe;
  }, [navigation, status]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.customer_name} - {item.product_name}</Text>
        <Text style={styles.itemSubText}>{t('affiliate')}: {item.affiliate_name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, padding: 10 },
  itemContainer: { backgroundColor: '#2C2C54', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  itemSubText: { color: colors.secondary, fontSize: 14, marginTop: 5 },
});

export default OrderList;
