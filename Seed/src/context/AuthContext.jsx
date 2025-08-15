import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (token, userData) => {
    try {
      console.log("Armazenando token:", token);
      await AsyncStorage.setItem('userToken', token);
      console.log("Token armazenado");
      setUserToken(token);
      setUser(userData);
      console.log("Estado atualizado");
    } catch (e) {
      console.error('Error during sign in:', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUser(null);
    } catch (e) {
      console.error('Error during sign out:', e);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        } else {
          setUserToken(null);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};