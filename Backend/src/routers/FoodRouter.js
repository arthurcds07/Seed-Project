const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/FoodController');

router.get('/', FoodController.getAllFoods);
router.get('/:id', FoodController.getFoodById);

module.exports = router;