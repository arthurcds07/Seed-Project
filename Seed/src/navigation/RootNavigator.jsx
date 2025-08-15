import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native'; // Adicionei os imports faltantes
import { AuthContext } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigator() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}