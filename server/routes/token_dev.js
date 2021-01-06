const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { tokenDevController } = require('../controllers')

routes.get('/checkTokenSymbol', checkRole(0, 1), tokenDevController.checkTokenSymbol)
routes.post('/', checkRole(0, 1), tokenDevController.createToken)
routes.get('/', checkRole(0, 1), tokenDevController.getListToken)
routes.delete('/request', checkRole(0, 1), tokenDevController.cancelRequest)
routes.post('/request', checkRole(0, 1), tokenDevController.createRequest)
routes.post('/validate', checkRole(0, 1), tokenDevController.validateSource)
routes.post('/testDeploy', checkRole(0, 1), tokenDevController.testDeploy)


routes.get('/:id', checkRole(0, 1), tokenDevController.getTokenById)

module.exports = routes
