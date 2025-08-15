//Calling Express dependencies 
const express = require('express')
const router = express.Router()//Express Router dependency responsible for handling all routes

const UserController = require('../controllers/UserController');

router.post('/create',  UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/:id', UserController.viewUser)
router.put('/update/:id', UserController.updateUser)
router.delete('/delete/:id', UserController.deleteUser)

//Exporting variable "router" with module.exports using require()
module.exports = router

//http://localhost:3003/api/user/create