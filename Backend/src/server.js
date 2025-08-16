const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3003;

const connection = require('./config/db');
const userRoutes = require('./routers/UserRouter');
const authRoutes = require('./routers/AuthRouter');
const foodRouter = require('./routers/FoodRouter');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/foods', foodRouter);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));