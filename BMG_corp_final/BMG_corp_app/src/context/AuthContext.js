import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token) => {
    setIsLoading(true);
    await AsyncStorage.setItem('userToken', token);
    const decodedUser = jwtDecode(token).user;
    setUser(decodedUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedUser = jwtDecode(token).user;
        setUser(decodedUser);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
