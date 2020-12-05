const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { templateTokenController } = require('../controllers')

routes.post('/', checkRole(0,1), templateTokenController.createTemplateToken)
routes.get('/', checkRole(0,1), templateTokenController.getListTemplateToken)
routes.get('/:id', checkRole(0,1), templateTokenController.getTemplateTokenById)
routes.put('/:id', checkRole(0,1), templateTokenController.updateTemplateToken)
routes.delete('/:id', checkRole(0,1), templateTokenController.deleteTemplateToken)


module.exports = routes
