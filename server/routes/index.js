var express = require('express');
var siteApp = express.Router();

const account = require("./account")
const config = require("./config")
const user = require('./user')
const token = require('./token')
const templateToken = require('./template_token')
const vchain = require("./vchain")


// define route here
siteApp.use("/account", account)
siteApp.use("/config", config)
siteApp.use('/templateToken', templateToken)
siteApp.use('/token', token)
siteApp.use('/user', user)
siteApp.use('/vchain', vchain)



module.exports = siteApp