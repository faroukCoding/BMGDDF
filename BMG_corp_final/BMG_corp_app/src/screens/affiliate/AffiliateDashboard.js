import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../services/api';

const AffiliateDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, confirmed: 0, pending: 0 });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders/my');
        setOrders(data);
        calculateSummary(data);
      } catch (error) {
        Alert.alert(t('errorTitle'), t('fetchOrdersFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const calculateSummary = (orderData) => {
    const total = orderData.reduce((sum, order) => sum + parseFloat(order.commission), 0);
    const confirmed = orderData.filter(o => o.status === 'delivered').reduce((sum, order) => sum + parseFloat(order.commission), 0);
    const pending = total - confirmed;
    setSummary({ total, confirmed, pending });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{item.customer_name} - {item.product_name}</Text>
      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{t(item.status)}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    if (status === 'delivered') return '#2ecc71';
    if (status === 'rejected' || status === 'failed_delivery') return '#e74c3c';
    return '#f1c40f';
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('affiliateDashboard')}</Text>
        <TouchableOpacity onPress={logout}>
            <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <SummaryCard title={t('totalCommissions')} value={`$${summary.total.toFixed(2)}`} />
        <SummaryCard title={t('confirmed')} value={`$${summary.confirmed.toFixed(2)}`} />
        <SummaryCard title={t('pending')} value={`$${summary.pending.toFixed(2)}`} />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateOrder')}>
        <Text style={styles.addButtonText}>➕ {t('addNewOrder')}</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>{t('recentOrders')}</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
};

const SummaryCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15},
  title: { fontSize: 26, color: colors.secondary, fontFamily: fonts.cairo, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  card: { backgroundColor: '#2C2C54', padding: 15, borderRadius: 10, alignItems: 'center', width: '30%' },
  cardTitle: { color: colors.secondary, fontSize: 14, fontFamily: fonts.cairo },
  cardValue: { color: colors.white, fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  addButton: { backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  addButtonText: { color: colors.white, fontSize: 18, fontFamily: fonts.cairo, fontWeight: 'bold' },
  listTitle: { fontSize: 20, color: colors.secondary, fontFamily: fonts.cairo, margin: 15, fontWeight: 'bold' },
  list: { flex: 1 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#2C2C54', padding: 15, borderRadius: 8, marginBottom: 10 },
  orderText: { color: colors.white, fontSize: 16 },
  statusText: { fontSize: 16, fontWeight: 'bold' },
});

export default AffiliateDashboard;
