const { Router } = require("express");
const { isAuth } = require('../middlewares/auth')

const routes = new Router()
const { templateDappController } = require('../controllers')

routes.post('/', isAuth, templateDappController.createTemplateDapp)
routes.get('/', isAuth, templateDappController.getListTemplateDapp)
routes.get('/:id', isAuth, templateDappController.getTemplateDappById)
routes.put('/:id', isAuth, templateDappController.updateTemplateDapp)
routes.delete('/:id', isAuth, templateDappController.deleteTemplateDapp)


module.exports = routes
