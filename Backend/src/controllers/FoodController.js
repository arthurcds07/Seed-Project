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

module.exports = {
  getAllFoods,
  getFoodById
};