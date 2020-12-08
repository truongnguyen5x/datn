const userService = require('./user')
const authService = require('./auth')
const tokenService = require('./token')
const templateTokenService = require('./template_token')
const configService = require("./config")
const accountService = require("./account")
const vchainService = require("./vchain")

module.exports = {
    userService,
    authService,
    tokenService,
    templateTokenService,
    configService,
    accountService,
    vchainService
}