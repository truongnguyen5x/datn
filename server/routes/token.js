const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { tokenController } = require('../controllers')

routes.post('/', isAuth, tokenController.createToken)


module.exports = routes
