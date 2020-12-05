var express = require('express');
var siteApp = express.Router();

const user = require('./user')
const token = require('./token')
const templateToken = require('./template_token')
const config = require("./config")

// define route here

siteApp.use('/user', user)
siteApp.use('/token', token)
siteApp.use('/templateToken', templateToken)
siteApp.use("/config", config)


module.exports = siteApp