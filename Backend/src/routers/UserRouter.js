const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const { uploadProfilePicture, handleProfilePictureUpload } = require('../controllers/UploadController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas de usuário
router.post('/create', UserController.createUser);
router.get('/:id', UserController.viewUser);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

// Rota de upload da foto de perfil

module.exports = router;
