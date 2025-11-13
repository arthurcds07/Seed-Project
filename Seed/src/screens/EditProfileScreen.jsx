// src/screens/EditProfileScreen.js

import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
  ScrollView, ActivityIndicator, Image, TouchableOpacity,
  Platform // <-- Adicionar Platform aqui
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ route, navigation }) => {

  const { user, setUser, signOut } = useContext(AuthContext);


  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profile_picture_url || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') { // Permissões são necessárias apenas para apps nativos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões de galeria para isso funcionar!');
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setProfilePictureUrl(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação de senha não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Erro de Autenticação', 'Você não está logado.');
        signOut();
        return;
      }

      let finalProfilePictureUrl = profilePictureUrl;
      if (selectedImageUri) {

        const formData = new FormData();
        const filename = selectedImageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        if (Platform.OS === 'web') {
          const response = await fetch(selectedImageUri);
          const blob = await response.blob();
          const file = new File([blob], filename, { type });
          formData.append('profilePicture', file);
        } else {
          formData.append('profilePicture', {
            uri: selectedImageUri,
            name: filename,
            type: type,
          });
        }
        
        
        try {
          console.log("Token usado no upload:", userToken);
          const uploadResponse = await axios.post(
            API_ENDPOINTS.UPLOAD_PROFILE_PICTURE,
            formData,
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );


          finalProfilePictureUrl = uploadResponse.data.imageUrl;
        } catch (uploadError) {
          console.error('Erro ao fazer upload da imagem de perfil:', uploadError.response?.data || uploadError.message);
          Alert.alert('Erro de Upload', 'Não foi possível fazer upload da foto de perfil. Verifique o console para detalhes.');
          setIsSubmitting(false);
          return;
        }
      }

      const updateData = {
        username: username.trim() === user.username ? undefined : username.trim(),
        email: email.trim() === user.email ? undefined : email.trim(),
        profile_picture_url: finalProfilePictureUrl === user.profile_picture_url ? undefined : finalProfilePictureUrl,
      };

      if (newPassword) {
        updateData.old_password = oldPassword;
        updateData.new_password = newPassword;
      }

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
      );

      if (Object.keys(filteredUpdateData).length === 0 && !selectedImageUri) {
        Alert.alert('Aviso', 'Nenhuma alteração detectada para salvar.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.UPDATE_USER(user.id),
        filteredUpdateData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // atualização do estado global do usuário no contexto
      setUser({
        ...user, //faz um spread do objeto atual do usuário, copiando todas as propriedades que existem do user (emial, id, senha etc.)
        username: username.trim() || user.username, //se o campo estiver vazio, mantém o valor antigo, senão atualiza e o trim remove espaços vazios desnecessários
        email: email.trim() || user.email,
        profile_picture_url: finalProfilePictureUrl || user.profile_picture_url,
      });

      Alert.alert('Sucesso', response.data.message);
      navigation.goBack();


    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Ocorreu um erro ao atualizar o perfil.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        signOut();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Erro', 'Digite sua senha para confirmar.');
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Erro de autenticação', 'Você não está logado.');
        signOut();
        return;
      }

      const response = await axios.delete(
        API_ENDPOINTS.DELETE_USER(user.id),
        {
          headers: { Authorization: `Bearer ${userToken}` },
          data: { password: deletePassword }, // se seu backend exige senha
        }
      );

      Alert.alert('Conta excluída', response.data.message || 'Sua conta foi excluída com sucesso.');
      signOut(); // remove token e redireciona
    } catch (error) {
      console.error('Erro ao excluir conta:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível excluir a conta.');
    } finally {
      setDeleteModalVisible(false);
      setDeletePassword('');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={pickImage} style={styles.profilePictureContainer}>
          {profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
          ) : (
            <Ionicons name="camera-outline" size={80} color="#ccc" style={styles.profilePicturePlaceholder} />
          )}
          <Text style={styles.changePhotoText}>Trocar foto de perfil</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nome de Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.sectionTitle}>Mudar Senha (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha Antiga"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleUpdateProfile} disabled={isSubmitting} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: '#ff4d4d', padding: 14, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Excluir Conta</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {deleteModalVisible && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '100%',
            maxWidth: 350,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Confirmar Exclusão</Text>
            <Text style={{ marginBottom: 15 }}>Digite sua senha para confirmar a exclusão da conta:</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={deletePassword}
              onChangeText={setDeletePassword}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={{ padding: 10 }}>
                <Text style={{ color: '#007bff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount} style={{ padding: 10 }}>
                <Text style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f0f0',
  },
  profilePicturePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    fontSize: 15,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 25,
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4EA12C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default EditProfileScreen;