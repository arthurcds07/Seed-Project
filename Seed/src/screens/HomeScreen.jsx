import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet} from "react-native";

const HomeScreen = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image source={require("../../assets/Menu.png")} style={{ width: 32, height: 32 }} />
            </TouchableOpacity>
            <Image source={require("../../assets/seed-logo.png")} style={{ width: 40, height: 40 }} />
            </View>
        </View>
    )
    
}
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ffffffff',
            padding: 10     
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#DFFFD6',
            borderRadius: 10,
        }
        
    });

export default HomeScreen;