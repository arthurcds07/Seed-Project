import React, { useContext }from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AuthContext } from "../context/AuthContext";

const CustomDrawerContent = (props) => {
    const { signOut } = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

        <TouchableOpacity style={styles.logOutButton} onPress={() => signOut()}>
            <Text style={styles.logOutText}>Sair</Text>
        </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
   container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoutWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logOutButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  logOutText: {
    color: '#fc0000ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomDrawerContent;