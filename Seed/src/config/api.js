//Arquivo para gerenciar os endpoints da API de forma dinamica entre PC e celular
import axios from 'axios';

// WEB
// const rota = 'http://localhost:3003/api';

// Celular
const rota = 'http://192.168.1.10:3003/api';

// Instância do axios
const api = axios.create({
  baseURL: rota,
  timeout: 10000, //tempo limite de 10 segundos
});

export const API_ENDPOINTS = {
  LOGIN: `http://192.168.1.10:3003/auth/login`, 
  REGISTER: `${rota}/user/create`, 
  GETUSER: `${rota}/user`,
  FOODS: `${rota}/foods`,
  MEALS: `${rota}/meals`,
  POSTS: `${rota}/posts`,
  UPDATE_USER: (userId) => `${rota}/user/update/${userId}`,
  DELETE_USER: (userId) => `${rota}/user/delete/${userId}`,
  USER_LIKES: (userId) => `${rota}/users/${userId}/likes`,
  USER_FAVORITES: (userId) => `${rota}/users/${userId}/favorites`,
  POST_LIKE: (postId) => `${rota}/posts/${postId}/like`,
  POST_FAVORITE: (postId) => `${rota}/posts/${postId}/favorite`,
  POST_BY_ID: (postId) => `${rota}/posts/${postId}`,
  COMMENTS_BY_POST_ID: (postId) => `${rota}/comments/${postId}`,
};