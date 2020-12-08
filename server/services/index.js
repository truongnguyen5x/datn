const userService = require('./user')
const authService = require('./auth')
const tokenService = require('./token')
const configService = require("./config")
const accountService = require("./account")
const vcoinService = require("./vcoin")
const networkService = require("./network")

module.exports = {
    userService,
    authService,
    tokenService,
    configService,
    accountService,
    vcoinService,
    networkService
}