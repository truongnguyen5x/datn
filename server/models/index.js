const User = require('./user')
const Token = require('./token')
const TemplateToken = require('./template')
const Config = require("./configs")
const { sequelize } = require('../configs')

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = { User, Token, TemplateToken, Config }