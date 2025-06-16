//Calling Express dependencies 
const express = require('express')
const router = express.Router()//Express Router dependency responsible for handling all routes

const { createUser, viewUser, updateUser, deleteUser } = require('/routers/UserControllers')

router.post('/User/CreateUser', createUser)
router.post('/User/LoginUser', loginUser)
router.get('/User/ViewUser', viewUser)
router.put('/User/UpdateUser', updateUser)
router.delete('/User/DeleteUser', deleteUser)

//Exporting variable "router" with module.exports using require()
module.exports = router

