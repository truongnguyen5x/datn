const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { accountController } = require('../controllers')

routes.post('/', checkRole(0,1), accountController.createAccount)
routes.get('/', checkRole(0,1), accountController.getListAccount)
routes.get('/:id', checkRole(0,1), accountController.getAccountById)
routes.put('/:id', checkRole(0,1), accountController.updateAccount)
routes.delete('/:id', checkRole(0,1), accountController.deleteAccount)
routes.post('/balance', checkRole(0,1), accountController.getListAccountBalance)


module.exports = routes
