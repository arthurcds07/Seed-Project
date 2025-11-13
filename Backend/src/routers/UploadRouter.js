// src/routers/UploadRouter.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  uploadProfilePicture,
  handleProfilePictureUpload,
  uploadPostImage,
  handlePostImageUpload
} = require('../controllers/UploadController');

// Rota protegida para upload de foto de perfil
router.post(
  '/profile-picture',
  verifyToken,             
  uploadProfilePicture,     
  handleProfilePictureUpload 
);

// Rota (opcional) para upload de imagem de post
router.post(
  '/post-image',
  verifyToken,
  uploadPostImage,
  handlePostImageUpload
);

module.exports = router;
