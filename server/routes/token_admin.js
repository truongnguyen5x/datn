const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { tokenAdminController } = require('../controllers')

routes.get('/', checkRole(0), tokenAdminController.getListToken)
routes.get('/:id', checkRole(0), tokenAdminController.getTokenById)
routes.post('/accept', checkRole(0), tokenAdminController.acceptRequest)
routes.post('/deny', checkRole(0), tokenAdminController.denyRequest)
routes.delete('/:id', checkRole(0), tokenAdminController.deleteToken)
routes.put('/', checkRole(0), tokenAdminController.updateToken)

module.exports = routes
