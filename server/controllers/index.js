const userController  = require('./user')
const tokenController = require('./token')
const vcoinController = require('./vcoin')
const configController = require("./config")
const accountController = require("./account")
const networkController = require("./network")
const fileController = require("./file")

module.exports = {
    userController,
    tokenController,
    configController,
    accountController,
    vcoinController,
    networkController,
    fileController
}