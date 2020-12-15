const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { tokenDevController } = require('../controllers')

routes.post('/', checkRole(0,1), tokenDevController.createToken)
routes.get('/', checkRole(0,1), tokenDevController.getListToken)
routes.get('/:id', checkRole(0,1), tokenDevController.getTokenById)
routes.delete('/request', checkRole(0,1), tokenDevController.cancelRequest)
routes.post('/request', checkRole(0,1), tokenDevController.createRequest)
routes.post('/validate', checkRole(0,1), tokenDevController.validateSource)
routes.post('/sdk/:id', checkRole(0,1), tokenDevController.exportSDK)
routes.post('/test', tokenDevController.testContract)

module.exports = routes
