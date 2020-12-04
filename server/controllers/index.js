const userController  = require('./user')
const tokenController = require('./token')
const templateTokenController = require('./template_token')
const templateDappController = require('./template_dapp')
const dappController = require("./dapp")

module.exports = {
    userController,
    tokenController,
    templateTokenController,
    dappController,
    templateDappController
}