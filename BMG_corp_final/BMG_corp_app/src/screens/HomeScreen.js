import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('welcome')}</Text>
      <Text style={styles.text}>You are logged in!</Text>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>{t('logoutButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.secondary,
    fontSize: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default HomeScreen;
