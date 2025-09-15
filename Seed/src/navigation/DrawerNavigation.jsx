import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import SocialMedia from '../screens/SocialMedia';
import ProfileScreen from '../screens/ProfileScreen';
import DietScreen from '../screens/DietScreen';


const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
            {/* <Drawer.Screen name="SocialMedia" component={SocialMedia} /> */}
            <Drawer.Screen name="Diet" component={DietScreen} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigation;