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
    
    const userEmail = req.body.email
    const userPassword = req.body.password
    const userName = req.body.username
  
  
    // Verifica se o usuário preencheu email ou nome, e senha
    if ((!userEmail && !userName) || !userPassword) {
      return res.status(400).json({
        success: false,
        message: "Por favor, informe seu email ou nome e sua senha.",
      });
    }

  
    let query;
    let params;
  
    // Monta a query de acordo com o dado fornecido
    if (userEmail) {
      query = `SELECT * FROM User WHERE email = ? AND password = ?`;
      params = [userEmail, userPassword];
    } else {
      query = `SELECT * FROM User WHERE username = ? AND password = ?`;
      params = [userName, userPassword];
    }
  
    // Executa a query no banco
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

// exports.editUser = (req, res) => {
//   const { userId, userEmail, userPassword, userName } = req.body;
//   const { id } = req.params;

//   if( !userId || !userEmail || !userPassword || !userName) {
//     return res.status(400).json({
//       success: false,
//       message: "Todos os campos devem ser preenchidos!",
//     });
//   }

// }


// exports.viewUser = (req, res) => {
//   const userId = req.params.id

//   if()  

// }