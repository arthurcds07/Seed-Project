// src/routes/postRoutes.js

const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', PostController.getPostById);
router.post('/', authMiddleware.verifyToken, PostController.createPost);
router.get('/', PostController.searchPosts); 

router.post('/:postId/like', authMiddleware.verifyToken, PostController.toggleLike);
router.delete('/:id', authMiddleware.verifyToken, PostController.deletePost);

module.exports = router;