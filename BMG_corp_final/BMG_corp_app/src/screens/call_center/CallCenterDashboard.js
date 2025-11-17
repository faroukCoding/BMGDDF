import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/api';
import { colors } from '../../theme/colors';

const CallCenterDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchConfirmedOrders = async () => {
    try {
        setLoading(true);
        const { data } = await apiClient.get('/orders?status=confirmed');
        setOrders(data);
    } catch (error) {
        Alert.alert(t('errorTitle'), t('fetchOrdersFailed'));
    } finally {
        setLoading(false);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchConfirmedOrders);
    return unsubscribe;
  }, [navigation]);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
        await apiClient.put(`/orders/${orderId}/status`, { status });
        Alert.alert(t('successTitle'), 'Order status updated!');
        fetchConfirmedOrders(); // Refresh list
    } catch (error) {
        Alert.alert(t('errorTitle'), 'Failed to update status.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.customer_name} - {item.product_name}</Text>
      <Text style={styles.itemSubText}>{item.customer_phone}</Text>
      <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.customer_phone)}>
          <Text style={styles.buttonText}>📞 {t('callCustomer')}</Text>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>{t('afterCall')}:</Text>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#27ae60'}]} onPress={() => handleUpdateStatus(item.id, 'out_for_delivery')}>
            <Text style={styles.buttonText}>{t('confirmed')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#c0392b'}]} onPress={() => handleUpdateStatus(item.id, 'rejected')}>
            <Text style={styles.buttonText}>{t('rejected')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#f39c12'}]} onPress={() => handleUpdateStatus(item.id, 'no_answer')}>
            <Text style={styles.buttonText}>{t('noAnswer')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{t('callCenterDashboard')}</Text>
        <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>{t('noOrdersToConfirm')}</Text>}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 10 },
    title: { fontSize: 24, color: colors.secondary, marginBottom: 20, textAlign: 'center' },
    itemContainer: { backgroundColor: '#2C2C54', padding: 15, borderRadius: 8, marginBottom: 10 },
    itemText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    itemSubText: { color: colors.secondary, fontSize: 16, marginVertical: 10, textAlign: 'center' },
    callButton: { backgroundColor: colors.button, padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 15},
    actionsContainer: { paddingTop: 10, borderTopWidth: 1, borderTopColor: '#444' },
    actionsTitle: { color: colors.secondary, textAlign: 'center', marginBottom: 10, fontSize: 14 },
    actionButton: { padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 5 },
    buttonText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
    emptyText: { color: colors.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 },
});

export default CallCenterDashboard;
