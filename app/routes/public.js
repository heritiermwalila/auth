const express = require('express')
const route = express.Router()
const PublicController = require('../controllers/PublicController')

route.get('', PublicController.index)

module.exports = route