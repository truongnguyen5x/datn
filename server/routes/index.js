var express = require('express');
var siteApp = express.Router();

const user = require('./user')
const token = require('./token')
const template = require('./template')
const dapp = require("./dapp")

// define route here

siteApp.use('/user', user)
siteApp.use('/token', token)
siteApp.use('/templateToken', template)
siteApp.use("/dapp", dapp)

module.exports = siteApp