import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { DietProvider } from './src/context/DietContext'; // Novo provider
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DietProvider>
          <RootNavigator />
        </DietProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}