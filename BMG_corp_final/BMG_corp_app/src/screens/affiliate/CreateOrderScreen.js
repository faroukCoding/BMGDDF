import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import apiClient from '../../services/api';

const CreateOrderScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get('/products');
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
      } catch (error) {
        Alert.alert(t('errorTitle'), t('fetchProductsFailed'));
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateOrder = async () => {
    if (!customerName || !customerPhone || !customerAddress || !selectedProduct) {
      Alert.alert(t('errorTitle'), t('fillAllFields'));
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/orders', {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        product_id: selectedProduct,
      });
      Alert.alert(t('successTitle'), t('orderCreatedSuccess'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('errorTitle'), t('orderCreationFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.primary }} size="large" color={colors.button} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('addNewOrder')}</Text>

      <TextInput style={styles.input} placeholder={t('customerName')} value={customerName} onChangeText={setCustomerName} />
      <TextInput style={styles.input} placeholder={t('customerPhone')} value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder={t('customerAddress')} value={customerAddress} onChangeText={setCustomerAddress} multiline />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => setSelectedProduct(itemValue)}
          style={styles.picker}
          dropdownIconColor={colors.white}
        >
          {products.map(p => <Picker.Item key={p.id} label={`${p.name} ($${p.price})`} value={p.id} color="black" />)}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreateOrder} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? t('loading') : t('createOrderButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 20 },
    title: { fontSize: 24, color: colors.secondary, fontFamily: fonts.cairo, marginBottom: 20, textAlign: 'center' },
    input: { width: '100%', backgroundColor: '#2C2C54', borderRadius: 8, padding: 15, fontSize: 16, color: colors.secondary, marginBottom: 15 },
    pickerContainer: { width: '100%', backgroundColor: '#2C2C54', borderRadius: 8, marginBottom: 15 },
    picker: { color: colors.white },
    button: { backgroundColor: colors.button, padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default CreateOrderScreen;
