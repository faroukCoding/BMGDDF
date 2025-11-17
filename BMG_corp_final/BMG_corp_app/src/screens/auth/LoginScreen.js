import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('errorTitle'), t('fillAllFields'));
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.token) {
        login(data.token);
      }
    } catch (error) {
      Alert.alert(t('errorTitle'), error.msg || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>{t('loginTitle')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('emailPlaceholder')}
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder={t('passwordPlaceholder')}
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? t('loading') : t('loginButton')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>{t('noAccount')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: colors.secondary,
    fontFamily: fonts.cairo,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#2C2C54',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: colors.button,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.cairo,
  },
  switchText: {
    color: colors.secondary,
    marginTop: 20,
    fontFamily: fonts.cairo,
  },
});

export default LoginScreen;
