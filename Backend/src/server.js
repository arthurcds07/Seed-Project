const express = require('express');
const cors = require('cors');
require('dotenv').config(); // se quiser usar JWT_SECRET do .env

const app = express();
const PORT = 3003;

const connection = require('./config/db');
const userRoutes = require('./routers/UserRouter');
const authRoutes = require('./routers/AuthRouter');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
