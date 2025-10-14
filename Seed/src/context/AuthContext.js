//este arquivo é responsável por gerenciar o estado de autenticação do usuário
//ele utiliza o AsyncStorage para armazenar o token do usuário e fornecer funções de login e logout

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); //Chave que prova que o usuário está logado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (token, userData) => {
    try {
      console.log("Armazenando token:", token);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData)) //para não quebrar 
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

  useEffect(() => { //Quando o aplicativo é iniciado, ele tenta carregar o token do AsyncStorage (verifica se o usuário está logado)
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