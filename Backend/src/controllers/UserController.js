// ------------------------------- Create User --------------------------------
const connection = require('../config/db')

exports.createUser = (req, res) => {

  const userEmail = req.body.email
  const userPassword = req.body.password
  const userName = req.body.username

  // Validação dos campos
  if (!userEmail || !userPassword || !userName) {
    return res.status(400).json({
      success: false,
      message: "Todos os campos devem ser preenchidos!",
    });
  }

  const query = `
      INSERT INTO User (email, password, username) VALUES (?, ?, ?)
    `;
  const params = [userEmail, userPassword, userName];

  connection.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar usuário",
        error: err,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: result,
    });
  });
};

// -------------------------------- Login User --------------------------------

exports.loginUser = (req, res) => {

  const identifier = req.body.identifier; // pode ser email ou username
  const userPassword = req.body.password;

  // Verifica se o usuário preencheu identifier e senha
  if (!identifier || !userPassword) {
    return res.status(400).json({
      success: false,
      message: "Por favor, informe seu e-mail ou nome de usuário e sua senha.",
    });
  }

  // Monta a query para buscar por email OU username
  const query = `
    SELECT * FROM User 
    WHERE (email = ? OR username = ?) AND password = ?
  `;
  const params = [identifier, identifier, userPassword];

  connection.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar usuário no banco de dados",
        error: err,
      });
    }

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso!",
        data: result[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Usuário ou senha incorretos.",
      });
    }
  });
};

// ------------------------------- Edit User -------------------------------

exports.updateUser = (req, res) => {

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

exports.viewUser = (req, res) => {

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

exports.deleteUser = (req, res) => {
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




