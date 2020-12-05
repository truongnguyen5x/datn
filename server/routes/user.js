const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { userController } = require('../controllers')

routes.get('/', checkRole(1), userController.getListUser)
routes.post('/signup', userController.signup)
routes.post('/signin', userController.signin)
routes.post('/refresh', userController.refreshToken)
routes.post('/logout', checkRole(0,1), userController.logout)
routes.post('/me', userController.me)

module.exports = routes
