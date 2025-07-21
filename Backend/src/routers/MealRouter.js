//Calling Express dependencies 
const express = require('express')
const router = express.Router()//Express Router dependency responsible for handling all routes

const { createMeal, viewMeal, updateMeal, deleteMeal } = require('/routers/MealController')

router.post('/Meal/CreateMeal', createMeal)
router.get('/Meal/ViewUser', viewMeal)
router.put('/Meal/UpdateUser', updateMeal)
router.delete('/Meal/DeleteUser', deleteMeal)

//Exporting variable "router" with module.exports using require()
module.exports = router

