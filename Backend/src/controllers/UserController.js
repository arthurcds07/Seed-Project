// src/controllers/UserController.js
const bcrypt = require('bcrypt');
const connection = require('../config/db');

// ------------------------------- Create User --------------------------------
const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verifica se já existe
    const checkQuery = 'SELECT * FROM User WHERE email = ? OR username = ?';
    connection.query(checkQuery, [email, username], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }

      if (rows.length > 0) {
        return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado' });
      }

    
      const hashedPassword = await bcrypt.hash(password, 10);   // Gera hash da senha nessa linha

 
      const insertQuery = 'INSERT INTO User (email, password, username) VALUES (?, ?, ?)';
      connection.query(insertQuery, [email, hashedPassword, username], (err, result) => {
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

// ------------------------------- Edit User -------------------------------

const updateUser = (req, res) => {
  
  console.log("Dados recebidos no update:", req.body);

  const userEmail = req.body.email
  const userPassword = req.body.password
  const userName = req.body.username
  const profilePicture_url = req.body.profile_picture_url;

  const userId = req.params.id;

  if (!userEmail && !userPassword && !userName && !profilePicture_url) {
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
    const hashedPassword = bcrypt.hashSync(userPassword, 10);
    fields.push("password = ?")
    values.push(hashedPassword)
  };

  if (userName) {
    fields.push("username = ?")
    values.push(userName)
  };

  if (profilePicture_url) {
    fields.push("profile_picture_url = ?")
    values.push(profilePicture_url)
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
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }
 
    return res.status(200).json({
      message: "Sucesso ao deletar usuário",
      success: true
    });
  });
};

module.exports = {
  createUser,
  updateUser,
  viewUser,
  deleteUser
};