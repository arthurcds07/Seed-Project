import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';


export default function WellcomeScreen({ navigation }) {

  return (
      <View style={styles.container}>
        <Image
            source={require('../../assets/seed-logo.png')}
            style={styles.logo}
            resizeMode="contain" 
        />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.signupText}>Inscreva-se com email</Text>
      </TouchableOpacity>

      <Text style={styles.questionText}>Já possui uma conta?</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Entrar agora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFD6', // verde claro
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {

    width: 280,
    height: 280,
    marginBottom: 40,
  },
  signupButton: {
    backgroundColor: '#2E2E2E', // preto/cinza
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  signupText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 14,
    color: '#1C3A13',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

