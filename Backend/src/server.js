const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3003;


const connection = require('./config/db')
//Create routers empty 
const user = require('./routers/UserRouter')

app.use(express.json())
app.use(cors())

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))



app.use('/api/user', user)
