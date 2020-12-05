const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { configController } = require('../controllers')

routes.post('/', checkRole(0, 1), configController.updateBatchConfig)
routes.get("/", checkRole(0, 1), configController.getConfigs)
routes.get("/:key", checkRole(0, 1), configController.getConfigByKey)

module.exports = routes
