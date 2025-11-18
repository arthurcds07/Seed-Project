// src/routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Buscar comentários de um post
router.get('/:postId', CommentController.getCommentsByPostId);

// Criar comentário (protegido)
router.post('/:postId', verifyToken, CommentController.createComment);

module.exports = router;