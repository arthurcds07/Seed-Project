const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/FoodController');

router.get('/', FoodController.getAllFoods);
router.get('/:id', FoodController.getFoodById);
router.get('/meal/:id', FoodController.getUserMeals);
router.get('/food/:id', FoodController.getMealFoods);
router.post('/meal', FoodController.createMeal);
router.post('/food', FoodController.createFood);

module.exports = router;