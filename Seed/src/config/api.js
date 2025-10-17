//Arquivo para gerenciar os endpoints da API de forma dinamica entre PC e celular
import axios from 'axios';

// WEB
// const rota = 'http://localhost:3003/api';

// Celular
const rota = 'http://172.20.91.166:3003/api';

// Instância do axios
const api = axios.create({
  baseURL: rota,
  timeout: 10000, //tempo limite de 10 segundos
});

export const API_ENDPOINTS = {
  LOGIN: `http://172.20.91.166:3003/auth/login`, 
  REGISTER: `${rota}/user/create`, 
  GETUSER: `${rota}/user`,
  FOODS: `${rota}/foods`,
  MEALS: `${rota}/meals`,
  POSTS: `${rota}/posts`,
};