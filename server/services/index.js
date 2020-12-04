const userService = require('./user')
const authService = require('./auth')
const tokenService = require('./token')
const templateTokenService = require('./template_token')
const templateDappService = require('./template_dapp')
const configService = require("./config")
const dappService = require("./dapp")

module.exports = {
    userService,
    authService,
    tokenService,
    templateTokenService,
    templateDappService,
    configService,
    dappService
}