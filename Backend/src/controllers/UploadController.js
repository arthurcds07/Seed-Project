const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connection = require('../config/db'); // Usa a mesma conexão do projeto

// -------------------- Configuração de armazenamento (foto de perfil) --------------------
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'profile_pictures');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Evita erro se req.user for undefined
    const userId = req.user?.id || 'anon';
    cb(null, `${userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// -------------------- Configuração de armazenamento (imagem de post) --------------------
const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'post_images');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'anon';
    cb(null, `post_${userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// -------------------- Filtro de arquivos --------------------
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

// -------------------- Middlewares do Multer --------------------
const uploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
}).single('profilePicture');

const uploadPostImage = multer({
  storage: postImageStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}).single('postImage');

// -------------------- Controllers --------------------
const handleProfilePictureUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não informado.' });
    }

    const imageUrl = `/uploads/profile_pictures/${req.file.filename}`;

    const query = 'UPDATE User SET profile_picture_url = ? WHERE id = ?';
    connection.query(query, [imageUrl, userId], (err) => {
      if (err) {
        console.error('Erro ao salvar URL da foto de perfil no DB:', err);
        return res.status(500).json({ message: 'Erro ao atualizar a foto de perfil.' });
      }

      res.status(200).json({
        message: 'Foto de perfil atualizada com sucesso!',
        imageUrl
      });
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const handlePostImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
  }

  const imageUrl = `/uploads/post_images/${req.file.filename}`;
  res.status(200).json({
    message: 'Imagem enviada com sucesso!',
    imageUrl
  });
};


module.exports = {
  uploadProfilePicture,
  handleProfilePictureUpload,
  uploadPostImage,
  handlePostImageUpload
};
