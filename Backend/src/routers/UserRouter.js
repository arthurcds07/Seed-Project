//Calling Express dependencies 
const express = require('express')
const router = express.Router //Express Router dependency responsible for handling all routes

const { CreateUser, ViewUser, UpdateUser, DeleteUser } = require('/routers/UserControllers')

router.post('/User/CreateUser', CreateUser)
router.get('/User/ViewUser', ViewUser)
router.put('/User/UpdateUser', UpdateUser)
router.delete('/User/DeleteUser', DeleteUser)

//Exporting variable "router" with module.exports using require()
module.exports = router

