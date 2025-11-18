const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const app = express();
const PORT = 3003;

const connection = require('./config/db');
const userRoutes = require('./routers/UserRouter');
const authRoutes = require('./routers/AuthRouter');
const foodRouter = require('./routers/FoodRouter');
const postRouter = require('./routers/PostRouter');
const uploadRouter = require('./routers/UploadRouter');
const commentRouter = require('./routers/CommentRouter');

app.use(express.json());
app.use(cors());

// Serve arquivos enviados (uploads)
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads'))); 
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/foods', foodRouter);
app.use('/api/posts', postRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/comments', commentRouter);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));