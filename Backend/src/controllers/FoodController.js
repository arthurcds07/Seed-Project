const connection = require('../config/db');

const getAllFoods = (req, res) => {
  const query = `
    SELECT 
      id,
      nome,
      porcao as portion,
      calorias,
      proteina as protein,
      carboidrato as carbs,
      gordura as fat
    FROM Alimentos
    ORDER BY nome
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

const getFoodById = async (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      nome,
      porcao as portion,
      calorias,
      proteina as protein,
      carboidrato as carbs,
      gordura as fat
    FROM Alimentos 
    WHERE id = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Erro no banco de dados" 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Alimento não encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: results[0]
    });
  });
};

const searchFoods = (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Termo de busca inválido" });
  }

  const query = `
    SELECT 
      id,
      nome,
      porcao as portion,
      calorias,
      proteina as protein,
      carboidrato as carbs,
      gordura as fat
    FROM Alimentos
    WHERE nome LIKE ?
    ORDER BY nome
  `;

  connection.query(query, [`%${q}%`], (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
    res.status(200).json({ success: true, data: results });
  });
};


//para aparecer a caixa de refeição de acordo com o usuario logado
const getUserMeals = (req, res) => {
  const {id} = req.params;

  const query = `SELECT * FROM Refeicoes WHERE id_usuario = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
}

const getMealFoods = (req, res) => {
  const {id} = req.params;

  const query = 'SELECT * FROM AlimentosRefeicoes WHERE id_refeicao = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
}

const createMeal = (req, res) => {
  const {id_usuario, nome} = req.body;

  const query = 'INSERT INTO Refeicoes (id_usuario, nome) VALUES (?, ?)';

  connection.query(query, [id_usuario, nome], (err, result) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
    res.status(201).json({
      success: true,
      message: "Refeição criada com sucesso",
      mealId: result.insertId
    });
  });
}

const createFood = (req, res) => {
  const {id_alimento, id_refeicao, quantidade} = req.body;

  const query = 'INSERT INTO AlimentosRefeicoes (id_alimento, id_refeicao, quantidade) VALUES (?, ?, ?)';

  connection.query(query, [id_alimento, id_refeicao, quantidade], (err, result) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
    res.status(201).json({
      success: true,
      message: "Alimento adicionado à refeição com sucesso",
      foodMealId: result.insertId
    });
  });
}

module.exports = {
  getAllFoods,
  searchFoods,
  getUserMeals,
  getMealFoods,
  createMeal,
  createFood,
  getFoodById
};