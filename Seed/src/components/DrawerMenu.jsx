import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DrawerMenu = () => {
    const navigation = useNavigation(); 

    return(
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text >Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Diet')}>
                
            </TouchableOpacity>
        </View>
    );
};

export default DrawerMenu;