import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";

const HomeScreen = ({ navigation }) => {
    return(
        <View style={container.style}>
            <TouchableOpacity onPress={navigation.openDrawer()}>
                <Image source={'../../assets/Menu.png'}></Image>
            </TouchableOpacity>
        </View>
    )
}   