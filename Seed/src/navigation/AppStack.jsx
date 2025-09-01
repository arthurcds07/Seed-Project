//Fluxo para usuário logados

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DietScreen from '../screens/DietScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_bottom',
      gestureDirection: 'vertical',
     }}
     > 
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Diet" component={DietScreen} />
    </Stack.Navigator>
  );
}
