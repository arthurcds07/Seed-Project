import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet} from "react-native";

const HomeScreen = ({ navigation }) => {
    return(
        <View style={container.styles}>
            <View style={header.styles}>
            <TouchableOpacity onPress={navigation.openDrawer()}>
                <Image source={'../../assets/Menu.png'}></Image>
                <Image source={'../../assets/seed-logo.png'}></Image>
            </TouchableOpacity>
            </View>
        </View>
    )
    
}
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ffffffff',
            padding: 10     
        }
        
    })
export default HomeScreen;