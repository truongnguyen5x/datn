var express = require('express');
var siteApp = express.Router();

const user = require('./user')
const token = require('./token')

// define route here

siteApp.use('/user', user)
siteApp.use('/token', token)

module.exports = siteApp