const db = require('../config/db');


const getCommentsByPostId = (req, res) => {
  const { postId } = req.params;

  const query = `
    SELECT
        c.id, c.content, c.created_at,
        u.id AS user_id, u.username, u.profile_picture_url
    FROM comments c
    JOIN user u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;

  db.query(query, [postId], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar comentários:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao buscar comentários.' });
    }
    return res.status(200).json(rows);
  });
};


const createComment = (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: 'O conteúdo do comentário não pode ser vazio.' });
  }

  const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  const values = [postId, userId, content];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao criar comentário:', err);
      return res.status(500).json({ message: 'Erro interno do servidor ao criar comentário.' });
    }
    return res.status(201).json({ message: 'Comentário adicionado com sucesso!', commentId: result.insertId });
  });
};

module.exports = {
  getCommentsByPostId,
  createComment, 
}