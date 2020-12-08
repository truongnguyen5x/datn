const userController  = require('./user')
const tokenController = require('./token')
const vcoinController = require('./vcoin')
const configController = require("./config")
const accountController = require("./account")

module.exports = {
    userController,
    tokenController,
    configController,
    accountController,
    vcoinController
}