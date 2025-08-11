//Calling Express dependencies 
const express = require('express')
const router = express.Router()//Express Router dependency responsible for handling all routes

const { createUser, loginUser, viewUser, updateUser, deleteUser } = require('../controllers/UserController')

router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/:id', viewUser)
// router.put('/update', updateUser)
// router.delete('/delete', deleteUser)

//Exporting variable "router" with module.exports using require()
module.exports = router

//http://localhost:3003/api/user/create