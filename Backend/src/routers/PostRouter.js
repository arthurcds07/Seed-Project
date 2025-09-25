// src/routes/postRoutes.js

const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas de Posts existentes (apenas para referência)
// router.get('/', postController.getAllPosts); // Será substituída/complementada por searchPosts
router.get('/:id', PostController.getPostById);
router.post('/', authMiddleware.verifyToken, PostController.createPost);

// Nova rota para buscar/pesquisar posts
router.get('/', PostController.searchPosts); // Agora esta rota vai lidar com a busca e todos os posts

// Rotas para interações (curtir/descurtir e favoritar/desfavoritar)
router.post('/:postId/like', authMiddleware.verifyToken, PostController.toggleLike);
router.post('/:postId/favorite', authMiddleware.verifyToken, PostController.toggleFavorite);

module.exports = router;