import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer"; //off canvas from react native
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false, // tira o header padrão
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Configurações" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
