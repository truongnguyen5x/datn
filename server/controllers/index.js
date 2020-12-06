const userController  = require('./user')
const tokenController = require('./token')
const templateTokenController = require('./template_token')
const configController = require("./config")
const accountController = require("./account")

module.exports = {
    userController,
    tokenController,
    templateTokenController,
    configController,
    accountController
}