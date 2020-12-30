const userController  = require('./user')
const tokenAdminController = require('./token-admin')
const tokenDevController = require('./token-dev')
const vcoinController = require('./vcoin')
const configController = require("./config")
const accountController = require("./account")
const networkController = require("./network")
const fileController = require("./file")

module.exports = {
    userController,
    tokenAdminController,
    tokenDevController,
    configController,
    accountController,
    vcoinController,
    networkController,
    fileController
}