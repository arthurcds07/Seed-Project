import React, { useContext }from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler"; // Corrigido o import
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    runOnJS,
} from "react-native-reanimated";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
    const { signOut } = useContext(AuthContext);

    const translateY = useSharedValue(0);

    // Nova API de gestos (Reanimated v3 + Gesture Handler v2)
    const panGesture = Gesture.Pan()
        .onStart(() => {
            // Inicializa o gesto
        })
        .onUpdate((event) => {
            if (event.translationY < 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY < -100) {
                runOnJS(navigation.navigate)('Diet');
            }
            translateY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            opacity: 1 - Math.min(0.5, Math.abs(translateY.value / 200)),
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={require("../../assets/Menu.png")}
                        style={{ width: 32, height: 32 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { signOut() }}
                >
                    <Image
                        source={require("../../assets/seed-logo.png")}
                        style={{ width: 40, height: 40 }}
                    />
                </TouchableOpacity>
            </View>



            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.content, animatedStyle]}>
                    <Text style={styles.title}>Comece escalando sua montanha do dia!</Text>

                    <View style={[styles.footer]}>
                        <Image
                            source={require("../../assets/arrow-up.png")}
                            style={{ width: 20, height: 20, marginVertical: 10 }}
                        />
                        <Text style={styles.hint}>Arraste para cima!</Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffffff',
        borderRadius: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C3A13',
        marginBottom: 20,
        textAlign: 'center',
    },
    hint: {
        fontSize: 16,
        color: '#1C3A13',
        fontStyle: 'italic',
    },
    footer: {
        top: 240,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default HomeScreen;