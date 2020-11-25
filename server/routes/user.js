const { Router } = require("express");

const routes = new Router()
const { userController } = require('../controllers')

routes.get('/', userController.getListUser)

module.exports = routes
