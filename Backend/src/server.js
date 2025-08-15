const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3003;

const connection = require('./config/db');

// routers
const user = require('./routers/UserRouter');
const authRoutes = require('./routers/AuthRouter');

app.use(express.json());
app.use(cors());


// rotas
app.use('/auth', authRoutes);
app.use('/api/user', user);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
