const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { userController } = require('../controllers')

routes.get('/', isAuth, userController.getListUser)
routes.post('/signup', userController.signup)
routes.post('/signin', userController.signin)
routes.post('/refresh', userController.refreshToken)
routes.post('/logout',isAuth,  userController.logout)
routes.get('/me', isAuth, userController.me)

module.exports = routes
