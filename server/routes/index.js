var express = require('express');
var siteApp = express.Router();

const user = require('./user')
const token = require('./token')
const templateToken = require('./template_token')
const templateDapp = require('./template_dapp')
const dapp = require("./dapp")

// define route here

siteApp.use('/user', user)
siteApp.use('/token', token)
siteApp.use('/templateToken', templateToken)
siteApp.use("/dapp", dapp)
siteApp.use("/templateDapp", templateDapp)

module.exports = siteApp