const express = require('express');
const cors = require('cors');
PORT = 3003;

//Create routers empty 
const usuario = require('/routers/UsuarioRouters')


const app = express();
app.use(express.json())
app.use(cors())

