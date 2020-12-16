const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { vcoinController } = require('../controllers')

routes.post('/', vcoinController.createVCoin)
routes.get('/', checkRole(0), vcoinController.getListVCoin)
routes.put('/', checkRole(0), vcoinController.updateVCoin)
routes.delete('/:id', checkRole(0), vcoinController.deleteVCoin)
routes.post('/sdk/:id', checkRole(0), vcoinController.exportSDK)


module.exports = routes
