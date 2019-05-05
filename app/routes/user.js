const express = require('express')
const route = express.Router()
const UserController = require('../controllers/UserController')
const {isAuth} = require('../../config/auth')

//GET REQUEST
route.get('/login', UserController.login)
route.get('/register', UserController.register)
route.get('/profile', isAuth, UserController.profile)
route.get('/forget-password', UserController.forgetPassword)

//POST REQUEST
route.post('/register', UserController.registerUser)
route.post('/login', UserController.loginUser)
route.get('/logout', UserController.logout)
module.exports = route