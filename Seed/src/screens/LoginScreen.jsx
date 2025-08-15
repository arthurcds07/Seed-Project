import React, { useState, useContext } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            console.log("Tentando fazer login com:", { email, password });
            const { data } = await axios.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            });

            console.log("Resposta da API:", data);

            if (data.success && data.token) {
                await signIn(data.token, data.data);
                console.log("Login bem-sucedido, token:", data.token);
                // O RootNavigator deve redirecionar automaticamente
            } else {
                Alert.alert("Erro no login", data.message);
            }
        } catch (e) {
            console.error("Erro completo:", e);
            Alert.alert("Erro no login", e.response?.data?.message || "Erro ao conectar");
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.formCard}>
                <TouchableOpacity onPress={() => navigation.navigate("Wellcome")}>
                    <Image
                        source={require("../../assets/seed-logo.png")}
                        style={styles.logo}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Bem-vindo de volta!</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#DFFFD6',
    },

    logo: {
        width: 150,
        height: 150,
        marginTop: 40,
    },
    formCard: {
        flex: 2.3,
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
        marginTop: 0,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1C3A13',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#B6E2A1',
        borderRadius: 8,
        backgroundColor: '#FFF',
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#1C3A13',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#1C3A13',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    secondaryButtonText: {
        color: '#1C3A13',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;