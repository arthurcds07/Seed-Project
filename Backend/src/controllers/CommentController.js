const connection = require('../config/db');


// GET /api/comments/:postId
const getCommentsByPostId = (req, res) => {
  const { postId } = req.params;
  const query = `
    SELECT
      c.id,
      c.content,
      c.created_at,
      u.id AS user_id,
      u.username,
      u.profile_picture_url
    FROM comments c
    JOIN user u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;

  connection.query(query, [postId], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar comentários:', err);
      return res.status(500).json({ message: 'Erro interno ao buscar comentários.' });
    }
    return res.status(200).json(rows);
  });
};


// POST /api/comments/:postId
const createComment = (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Não autorizado.' });
  if (!content || !content.trim()) return res.status(400).json({ message: 'Comentário vazio.' });

  const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  connection.query(query, [postId, userId, content.trim()], (err, result) => {
    if (err) {
      console.error('Erro ao criar comentário:', err);
      return res.status(500).json({ message: 'Erro interno ao criar comentário.' });
    }
    return res.status(201).json({ message: 'Comentário criado.', commentId: result.insertId });
  });
};

module.exports = {
  getCommentsByPostId,
  createComment
};