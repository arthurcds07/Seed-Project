// ------------------------------- Create User --------------------------------
// src/controllers/UserController.js
const bcrypt = require('bcrypt');
const connection = require('../config/db');

const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verifica se já existe
    const checkSql = 'SELECT * FROM User WHERE email = ? OR username = ?';
    connection.query(checkSql, [email, username], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }

      if (rows.length > 0) {
        return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado' });
      }

      // Gera hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere no banco
      const insertSql = 'INSERT INTO User (email, password, username) VALUES (?, ?, ?)';
      connection.query(insertSql, [email, hashedPassword, username], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        }

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// -------------------------------- Login User --------------------------------

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Por favor, informe seu e-mail e sua senha.",
    });
  }

  const query = 'SELECT * FROM User WHERE email = ?';
  
  connection.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar usuário",
        error: err,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta",
      });
    }

    // Se chegou aqui, login é válido
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id },
      'senhaSecreta',
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token: "tokeni" 
    });
  });
};
// ------------------------------- Edit User -------------------------------

const updateUser = (req, res) => {

  const userEmail = req.body.email
  const userPassword = req.body.password
  const userName = req.body.username
  const profilePicture = req.body.profile_picture;

  const userId = req.params.id;

  if (!userEmail && !userPassword && !userName) {
    return res.status(400).json({
      success: false,
      message: "Preencha ao menos um campo para atualizar!",
    });
  }

  const fields = []
  const values = []

  if (userEmail) {
    fields.push("email = ?")
    values.push(userEmail)
  };

  if (userPassword) {
    fields.push("password = ?")
    values.push(userPassword)
  };

  if (userName) {
    fields.push("username = ?")
    values.push(userName)
  };

  if (profilePicture) {
    fields.push("profile_picture = ?")
    values.push(profilePicture)
  };


  const query = `UPDATE User SET ${fields.join(", ")} WHERE id = ?`;
  values.push(userId)

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao buscar usuário no servidor",
        success: false
      });
    } else {
      return res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        success: true
      })
    }
  }
  );
};

// ------------------------------- View User -------------------------------

const viewUser = (req, res) => {

  const userId = Number(req.params.id); //garaintir que seja um número válido

  //verifica numero e se é positivo
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Insira um valor de ID válido!",
      success: false
    });
  }

  const query = `SELECT * FROM User WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao buscar usuário no servidor",
        success: false
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    return res.status(200).json({
      message: "Sucesso ao buscar usuário",
      success: true,
      data: result[0] // retorna apenas o usuário encontrado
    });
  });
};

// ------------------------------- Delete User -------------------------------

const deleteUser = (req, res) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Insira um valor de ID válido!",
      success: false
    });
  }

  const query = `DELETE FROM User WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erro ao buscar usuário no servidor",
        success: false
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    return res.status(200).json({
      message: "Sucesso ao deletar usuário",
      success: true,
      data: result[0] // retorna apenas o usuário encontrado
    });
  });
    return res.status(200).json({
    message: "Sucesso ao deletar usuário",
    success: true,
    data: result[0] // retorna apenas o usuário encontrado
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  viewUser,
  deleteUser
};