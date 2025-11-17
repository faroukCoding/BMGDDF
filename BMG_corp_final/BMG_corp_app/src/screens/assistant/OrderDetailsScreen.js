import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/api';
import { colors } from '../../theme/colors';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This endpoint doesn't exist yet, so this is a placeholder.
    // I will assume for now that the full order object is passed in navigation params.
    // This will be fixed when the backend is updated.
    // For now, I will simulate a fetch.
    const fetchOrder = async () => {
        try {
            // Placeholder: In a real app, you would fetch `/orders/${orderId}`
            // For now, we assume the full object might be passed or needs fetching
            // Let's go back and fetch the full list and find it. This is inefficient but works for now.
            const { data } = await apiClient.get('/orders');
            const foundOrder = data.find(o => o.id === orderId);
            setOrder(foundOrder);
        } catch (error) {
            Alert.alert(t('errorTitle'), 'Failed to fetch order details.');
        } finally {
            setLoading(false);
        }
    }
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (status) => {
    try {
        await apiClient.put(`/orders/${orderId}/status`, { status });
        Alert.alert(t('successTitle'), 'Order status updated!');
        navigation.goBack();
    } catch (error) {
        Alert.alert(t('errorTitle'), 'Failed to update status.');
    }
  }

  if (loading || !order) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('orderDetails')}</Text>
      <DetailRow label={t('customerName')} value={order.customer_name} />
      <DetailRow label={t('customerPhone')} value={order.customer_phone} />
      <DetailRow label={t('customerAddress')} value={order.customer_address} />
      <DetailRow label={t('productName')} value={order.product_name} />
      <DetailRow label={t('affiliate')} value={order.affiliate_name} />
      <DetailRow label={t('status')} value={t(order.status)} />

      {order.status === 'pending_review' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => handleUpdateStatus('confirmed')}>
            <Text style={styles.buttonText}>{t('confirmOrder')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleUpdateStatus('rejected')}>
            <Text style={styles.buttonText}>{t('rejectOrder')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 20 },
    title: { fontSize: 24, color: colors.secondary, marginBottom: 20, textAlign: 'center' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    label: { color: colors.secondary, fontSize: 16, fontWeight: 'bold' },
    value: { color: colors.white, fontSize: 16, flex: 1, textAlign: 'right' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
    button: { padding: 15, borderRadius: 8, width: '45%', alignItems: 'center' },
    confirmButton: { backgroundColor: '#27ae60' },
    rejectButton: { backgroundColor: '#c0392b' },
    buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default OrderDetailsScreen;
