import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
import WellcomeScreen from "./WellcomeScreen";

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3003/api/user/create', {
                email,
                password,
                username
            });
            Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login.');
            navigation.navigate('Login');
        } catch (e) {
            console.error('Erro ao cadastrar:', e.response?.data || e.message);
            Alert.alert('Erro no cadastro', e.response?.data?.message || 'Ocorreu um erro ao cadastrar o usuário.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formCard}>

                <TouchableOpacity onPress={() => navigation.navigate('Wellcome')}>
                    <Image
                        source={require('../../assets/seed-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                        accessibilityLabel="Seed Logo"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>Crie sua conta!</Text>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nome de Usuário'
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.secondaryButtonText}>Já tem uma conta? Faça login</Text>
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

export default RegisterScreen;