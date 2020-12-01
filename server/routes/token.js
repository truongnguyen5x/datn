const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { tokenController } = require('../controllers')

routes.post('/', isAuth, tokenController.createToken)
routes.get('/', isAuth, tokenController.getListToken)
routes.get('/:id', isAuth, tokenController.getTokenById)
routes.put('/:id', isAuth, tokenController.updateToken)
routes.delete('/:id', isAuth, tokenController.deleteToken)


module.exports = routes
