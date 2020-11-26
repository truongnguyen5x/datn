var express = require('express');
var siteApp = express.Router();

const user = require('./user')

// define route here

siteApp.use('/user', user)

module.exports = siteApp