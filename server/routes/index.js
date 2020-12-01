var express = require('express');
var siteApp = express.Router();

const user = require('./user')
const token = require('./token')
const template = require('./template')

// define route here

siteApp.use('/user', user)
siteApp.use('/token', token)
siteApp.use('/templateToken', template)

module.exports = siteApp