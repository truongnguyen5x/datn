const userService = require('./user')
const authService = require('./auth')
const tokenAdminService = require('./token-admin')
const tokenDevService = require('./token-dev')
const configService = require("./config")
const accountService = require("./account")
const vcoinService = require("./vcoin")
const networkService = require("./network")
const fileService = require("./file")

module.exports = {
    userService,
    authService,
    tokenAdminService,
    tokenDevService,
    configService,
    accountService,
    vcoinService,
    networkService,
    fileService
}