// src/controllers/AuthController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const connection = require('../config/db'); 


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; //validando se email e senha foram informados

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios',
      });
    }

    const sql = 'SELECT * FROM User WHERE email = ?'; 
    connection.query(sql, [email], async (err, rows) => {
      if (err) {
        console.error('Erro no SELECT:', err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
      }

      const user = rows && rows[0];
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }

     
      // const ok = password === user.password; //Comparando senha em texto puro (não recomendado mas vou deixar aqui caso de erro usar mais tarde)


      const ok = await bcrypt.compare(password, user.password); //senha comparada com bcrypt 

      if (!ok) {
        return res.status(401).json({ success: false, message: 'Senha inválida' });
      }

      // 4) gera JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '1h' }
      );

      // 5) responde
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        data: { id: user.id, email: user.email, username: user.username },
      });
    });
  } catch (e) {
    console.error('Erro no login:', e);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};
