const { Router } = require("express");
const { checkRole } = require('../middlewares/auth')

const routes = new Router()
const { fileController } = require('../controllers')


routes.get('/:id', checkRole(0,1), fileController.getFileById)


module.exports = routes
