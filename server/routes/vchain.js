const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { vchainController } = require('../controllers')

routes.post('/', checkRole(0,1), vchainController.createVChain)
routes.get('/', checkRole(0,1), vchainController.getListVChain)
routes.get('/:id', checkRole(0,1), vchainController.getVChainById)
routes.put('/:id', checkRole(0,1), vchainController.updateVChain)
routes.delete('/:id', checkRole(0,1), vchainController.deleteVChain)


module.exports = routes
