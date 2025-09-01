//Arquivo para gerenciar os endpoints da API de forma dinamica entre PC e celular

// WEB
const rota = 'http://localhost:3003/api';

// Celular
// const rota = 'http://172.20.91.188:3003/api';

export const API_ENDPOINTS = {
  LOGIN: `${rota}/user/login`, 
  REGISTER: `${rota}/user/create`, 
  FOODS: `${rota}/foods`,
  MEALS: `${rota}/meals`
  
};