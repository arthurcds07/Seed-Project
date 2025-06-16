const { OAuth2Client } = require('google-auth-library');
const connection = require('../config/db'); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body; // token enviado pelo frontend após login Google

  try {
    // Verifica se o token é válido e pega os dados do usuário do Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload; // sub = google_id

    // 1 - Verifica se usuário já existe no banco pelo email
    const checkQuery = 'SELECT * FROM User WHERE email = ?';
    connection.query(checkQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erro no banco', error: err });
      }

      if (result.length > 0) {
        // Usuário existe, faz login retornando os dados
        return res.status(200).json({
          success: true,
          message: 'Login bem-sucedido',
          user: result[0],
        });
      } else {
        // Usuário não existe, cria no banco com os dados do Google
        const insertQuery = `
          INSERT INTO User (user_name, email, profile_picture, google_id)
          VALUES (?, ?, ?, ?)
        `;
        connection.query(insertQuery, [name, email, picture, sub], (err, insertResult) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar', error: err });
          }

          return res.status(201).json({
            success: true,
            message: 'Usuário cadastrado e logado com sucesso',
            user: {
              id: insertResult.insertId,
              user_name: name,
              email,
              profile_picture: picture,
              google_id: sub,
            },
          });
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Token inválido',
      error: error.message,
    });
  }
};
