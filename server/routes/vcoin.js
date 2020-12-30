const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { vcoinController } = require('../controllers')

routes.post('/', vcoinController.createVCoin)
routes.get('/', checkRole(0, 1), vcoinController.getListVCoin)
routes.put('/', checkRole(0), vcoinController.updateVCoin)
routes.delete('/:id', checkRole(0), vcoinController.deleteVCoin)
routes.post('/testDeploy', checkRole(0, 1), vcoinController.testDeploy)


module.exports = routes
