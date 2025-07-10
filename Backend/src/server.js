const express = require('express');
const cors = require('cors');
PORT = 3003;
const connection = require('./config/db')
//Create routers empty 
const usuario = require('/routers/UsuarioRouters')
const app = express();


app.use(express.json())
app.use(cors())

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))


exports.createUser;

app.use('/api/usuario', usuario)
//http://localhost:3003/api/usuario/CreateUser