const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { templateTokenController } = require('../controllers')

routes.post('/', isAuth, templateTokenController.createTemplateToken)
routes.get('/', isAuth, templateTokenController.getListTemplateToken)
routes.get('/:id', isAuth, templateTokenController.getTemplateTokenById)
routes.put('/:id', isAuth, templateTokenController.updateTemplateToken)
routes.delete('/:id', isAuth, templateTokenController.deleteTemplateToken)


module.exports = routes
