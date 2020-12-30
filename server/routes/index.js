var express = require('express');
var siteApp = express.Router();

const account = require("./account")
const config = require("./config")
const user = require('./user')
const tokenDev = require('./token_dev')
const tokenAdmin = require('./token_admin')
const vcoin = require("./vcoin")
const network = require("./network")
const file = require("./file")

// define route here
siteApp.use("/account", account)
siteApp.use("/config", config)
siteApp.use('/token-dev', tokenDev)
siteApp.use('/token-admin', tokenAdmin)
siteApp.use('/user', user)
siteApp.use('/vcoin', vcoin)
siteApp.use("/network", network)
siteApp.use("/file", file)



module.exports = siteApp