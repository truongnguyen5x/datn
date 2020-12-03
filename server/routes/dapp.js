const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { dappController } = require('../controllers')

routes.post('/', isAuth, dappController.createDapp)
routes.get('/', isAuth, dappController.getListDapp)
routes.get('/:id', isAuth, dappController.getDappById)
routes.put('/:id', isAuth, dappController.updateDapp)
routes.delete('/:id', isAuth, dappController.deleteDapp)


module.exports = routes
