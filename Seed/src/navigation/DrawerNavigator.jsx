import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import DietScreen from '../screens/DietScreen';
// import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from "../context/AuthContext";
import SocialScreen from '../screens/SocialScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { signOut } = useContext(AuthContext);


  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.2)',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Diet" component={DietScreen} />
      <Drawer.Screen name="Social" component={SocialScreen} />
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}


      <Drawer.Screen
        name="Logout"
        component={HomeScreen} // Componente fictício, não será realmente usado
        options={{
          drawerLabel: ({ color }) => (
            <TouchableOpacity style={styles.logOutButton} onPress={() => signOut()}>  
              <Text style={styles.logOutText}>Sair</Text>
            </TouchableOpacity>
          )}} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  logOutButton: {
    flex: 1,
    marginTop: 640,
    padding: 10,
    borderRadius: 50,    
  },
  logOutText: {
    color: '#fc0000ff',
    fontWeight: 'bold',  
    textAlign: 'center',
  },
});

export default DrawerNavigator;
