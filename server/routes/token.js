const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { tokenController } = require('../controllers')

routes.post('/', checkRole(0,1), tokenController.createToken)
routes.get('/', checkRole(0,1), tokenController.getListToken)
routes.get('/:id', checkRole(0,1), tokenController.getTokenById)
routes.put('/:id', checkRole(0,1), tokenController.updateToken)
routes.delete('/request', checkRole(0,1), tokenController.cancelRequest)
routes.delete('/:id', checkRole(0), tokenController.deleteToken)
routes.post('/validate', checkRole(0,1), tokenController.validateSource)
routes.post('/request', checkRole(0,1), tokenController.createRequest)
routes.post('/accept', checkRole(0), tokenController.acceptRequest)
routes.post('/deny', checkRole(0), tokenController.denyRequest)
routes.post('/test', tokenController.testContract)


module.exports = routes
