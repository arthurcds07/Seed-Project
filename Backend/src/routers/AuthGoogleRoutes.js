const express = require('express')
const router = express.Router() //Express Router dependency responsible for handling all routes
const AuthGoogleController = require('../controllers/AuthGoogleController')

router.post ('/google', AuthGoogleController.googleLogin)

module.exports = router