import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';




const SocialCreen = ({ navigation }) => {

    const translateY = useSharedValue(0);
    
    const panGesture = Gesture.Pan() //cria um gesto de arrastar, detectando o movimento do dedo na tela
        .onStart(() => { 
            // Vai executar quando o gesto começar
        })
        .onUpdate((event) => { //serve pra quando 
            if (event.translationY < 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY < 100) {
                runOnJS(navigation.navigate)('Home');
            }
            translateY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            opacity: 1 - Math.min(0.5, Math.abs(translateY.value / 200)),
        };
    });

    return(
    
    <GestureDetector gesture={panGesture}>
    <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>essa é a tela da rede social!</Text>

        <View style={[styles.footer]}>
            <Text>^^^^^^^^^^^^</Text>
            <Text style={styles.hint}>Arraste para baixo!</Text>
        </View>
    </Animated.View>
    </GestureDetector>
  
);
};












export default SocialCreen;