import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../config/db.js'; // conexão com MySQL

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Verifica se o usuário existe
    const [user] = await db.query('SELECT * FROM users WHERE (email = ? OR username = ?)', [identifier]);
    if (!user.length) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const foundUser = user[0];

    // Compara a senha
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // Gera o token
    const token = jwt.sign(
      { id: foundUser.id, identifier: foundUser.identifier },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: foundUser.id, identifier: foundUser.identifier } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no login' });
  }
};
