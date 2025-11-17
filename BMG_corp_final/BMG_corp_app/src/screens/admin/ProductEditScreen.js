import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import apiClient from '../../services/api';

const ProductEditScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const isEditing = product !== null;
  const { t } = useTranslation();

  const [name, setName] = useState(isEditing ? product.name : '');
  const [description, setDescription] = useState(isEditing ? product.description : '');
  const [price, setPrice] = useState(isEditing ? product.price.toString() : '');
  const [commission, setCommission] = useState(isEditing ? product.commission.toString() : '');
  const [imageUrl, setImageUrl] = useState(isEditing ? product.image_url : '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price || !commission) {
      Alert.alert(t('errorTitle'), t('fillAllFields'));
      return;
    }
    setLoading(true);
    const productData = { name, description, price: parseFloat(price), commission: parseFloat(commission), image_url: imageUrl };

    try {
      if (isEditing) {
        await apiClient.put(`/products/${product.id}`, productData);
      } else {
        await apiClient.post('/products', productData);
      }
      Alert.alert(t('successTitle'), isEditing ? t('productUpdatedSuccess') : t('productCreatedSuccess'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('errorTitle'), isEditing ? t('productUpdateFailed') : t('productCreateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? t('editProduct') : t('addNewProduct')}</Text>

      <TextInput style={styles.input} placeholder={t('productName')} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder={t('productDescription')} value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder={t('productPrice')} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder={t('productCommission')} value={commission} onChangeText={setCommission} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder={t('productImageUrl')} value={imageUrl} onChangeText={setImageUrl} />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? t('loading') : t('save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary, padding: 20 },
    title: { fontSize: 24, color: colors.secondary, marginBottom: 20, textAlign: 'center' },
    input: { width: '100%', backgroundColor: '#2C2C54', borderRadius: 8, padding: 15, fontSize: 16, color: colors.secondary, marginBottom: 15 },
    button: { backgroundColor: colors.button, padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default ProductEditScreen;
