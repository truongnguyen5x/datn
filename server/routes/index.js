var express = require('express');
var siteApp = express.Router();

const account = require("./account")
const config = require("./config")
const user = require('./user')
const token = require('./token')
const vcoin = require("./vcoin")
const network = require("./network")

// define route here
siteApp.use("/account", account)
siteApp.use("/config", config)
siteApp.use('/token', token)
siteApp.use('/user', user)
siteApp.use('/vcoin', vcoin)
siteApp.use("/network", network)



module.exports = siteApp