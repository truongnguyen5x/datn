const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { vcoinController } = require('../controllers')

routes.post('/', checkRole(0,1), vcoinController.createVCoin)
routes.get('/', checkRole(0,1), vcoinController.getListVCoin)
routes.get('/:id', checkRole(0,1), vcoinController.getVCoinById)
routes.put('/:id', checkRole(0,1), vcoinController.updateVCoin)
routes.delete('/:id', checkRole(0,1), vcoinController.deleteVCoin)
routes.post('/sdk/:id', checkRole(0,1), vcoinController.exportSDK)


module.exports = routes
