const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { networkController } = require('../controllers')


routes.get('/', checkRole(0,1), networkController.getListNetwork)



module.exports = routes
