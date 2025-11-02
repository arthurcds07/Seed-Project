const connection = require('../config/db');

// Obter todos os posts
const getAllPosts = (req, res) => {
  const query = `
    SELECT
        p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
        u.id AS user_id, u.username, u.profile_picture_url,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN user u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;

  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar posts:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao buscar posts.' });
    }
    return res.status(200).json(rows);
  });
};

// Criar um novo post
const createPost = (req, res) => {
  const { title, content, image_url } = req.body;
  const userId = req.user.id;

  if (!title || !content || !userId) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
  }

  const query = 'INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)';
  const values = [userId, title, content, image_url || null];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao criar post:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao criar post.' });
    }
    return res.status(201).json({ message: 'Post criado com sucesso!', postId: result.insertId });
  });
};

// Obter um único post por ID
const getPostById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
        p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
        u.id AS user_id, u.username, u.profile_picture_url,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN user u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  connection.query(query, [id], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar post por ID:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao buscar post.' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }

    return res.status(200).json(rows[0]);
  });
};

// Curtir/descurtir post
const toggleLike = (req, res) => {
  const { postId }  = req.params;
  const userId = req.user.id;

  const checkQuery = 'SELECT id FROM likes WHERE post_id = ? AND user_id = ?';
  connection.query(checkQuery, [postId, userId], (err, existingLike) => {
    if (err) {
      console.error('Erro ao verificar like:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao curtir/descurtir post.' });
    }

    if (existingLike.length > 0) {
      const deleteQuery = 'DELETE FROM likes WHERE id = ?';
      connection.query(deleteQuery, [existingLike[0].id], (err) => {
        if (err) {
          console.error('Erro ao remover like:', err);
          return res.status(500).json({ message: 'Erro interno ao remover like.' });
        }
        return res.status(200).json({ message: 'Like removido com sucesso.', liked: false });
      });
    } else {
      const insertQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
      connection.query(insertQuery, [postId, userId], (err) => {
        if (err) {
          console.error('Erro ao adicionar like:', err);
          return res.status(500).json({ message: 'Erro interno ao adicionar like.' });
        }
        return res.status(201).json({ message: 'Post curtido com sucesso.', liked: true });
      });
    }
  });
};

// Favoritar/desfavoritar post
const toggleFavorite = (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const checkQuery = 'SELECT id FROM favorites WHERE post_id = ? AND user_id = ?';
  connection.query(checkQuery, [postId, userId], (err, existingFavorite) => {
    if (err) {
      console.error('Erro ao verificar favorito:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao favoritar/desfavoritar post.' });
    }

    if (existingFavorite.length > 0) {
      const deleteQuery = 'DELETE FROM favorites WHERE id = ?';
      connection.query(deleteQuery, [existingFavorite[0].id], (err) => {
        if (err) {
          console.error('Erro ao remover favorito:', err);
          return res.status(500).json({ message: 'Erro interno ao remover favorito.' });
        }
        return res.status(200).json({ message: 'Favorito removido com sucesso.', favorited: false });
      });
    } else {
      const insertQuery = 'INSERT INTO favorites (post_id, user_id) VALUES (?, ?)';
      connection.query(insertQuery, [postId, userId], (err) => {
        if (err) {
          console.error('Erro ao adicionar favorito:', err);
          return res.status(500).json({ message: 'Erro interno ao adicionar favorito.' });
        }
        return res.status(201).json({ message: 'Post adicionado aos favoritos.', favorited: true });
      });
    }
  });
};

// Buscar posts com ou sem termo de pesquisa
const searchPosts = (req, res) => {
  const { q } = req.query;
  let query = `
    SELECT
        p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
        u.id AS user_id, u.username, u.profile_picture_url,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN user u ON p.user_id = u.id
  `;
  let params = [];

  if (q) {
    query += ` WHERE p.title LIKE ? OR p.content LIKE ?`;
    params.push(`%${q}%`, `%${q}%`);
  }

  query += ` ORDER BY p.created_at DESC`;

  connection.query(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar/pesquisar posts:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao buscar/pesquisar posts.' });
    }
    return res.status(200).json(rows);
  });
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  toggleLike,
  toggleFavorite,
  searchPosts
};
